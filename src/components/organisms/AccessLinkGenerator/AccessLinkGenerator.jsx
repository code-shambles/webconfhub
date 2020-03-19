import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { Button, Message } from '../../';

import './AccessLinkGenerator.less';

const LWR_ROOM_REGEX = /\/(\d{3}\-\d{3}\-\d{3})\//;
const REG_TOKEN_REGEX = /p\/(\w{24,64})/;
const PASS_TOKEN_REGEX = /_password_token=(\w{4,8})/;

const csvJSON = csv => {
  let lines = csv.split(/\r\n|\r|\n/);
  let result = [];
  let headers = lines[0].split(',');
  headers = headers.map(function(h) {
    return h.trim();
  });

  for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentline = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      if (currentline[j]) {
        obj[headers[j]] = currentline[j].trim();
      } else {
        obj[headers[j]] = '';
      }
    }
    result.push(obj);
  }
  return result;
};

const jsonCSV = json => {
  const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  const header = Object.keys(json[0]);
  let csv = json.map(row =>
    header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
  );
  csv.unshift(header.join(','));
  return csv.join('\r\n');
};

const countRows = str => {
  return str.length ? str.split(/.+\r\n|.+\r|.+\n/).length : 0;
};

const parseLwrLink = lrwLink => {
  const roomMatches = lrwLink.match(LWR_ROOM_REGEX);
  const regTokenMatches = lrwLink.match(REG_TOKEN_REGEX);
  const passTokenMatches = lrwLink.match(PASS_TOKEN_REGEX);
  const roomId = roomMatches ? roomMatches[1] : null;
  const regToken = regTokenMatches ? regTokenMatches[1] : null;
  const passToken = passTokenMatches ? passTokenMatches[1] : null;

  return { roomId, regToken, passToken };
};

const combineLwrInvitationsToJson = allLwrInvitations => {
  const invitationsByEmail = {};

  Object.keys(allLwrInvitations).forEach(livewebinarRoomId => {
    const roomInvitationsJson = csvJSON(allLwrInvitations[livewebinarRoomId]);

    roomInvitationsJson.forEach(roomInv => {
      const invsForEmail = invitationsByEmail[roomInv.email] || [];

      invsForEmail.push({
        email: roomInv.email,
        firstName: roomInv.firstname,
        lastName: roomInv.lastname,
        ...parseLwrLink(roomInv.lwrlink),
      });

      invitationsByEmail[roomInv.email] = invsForEmail;
    });
  });

  return invitationsByEmail;
};

const generateAccessLink = (url, emailInvData) => {
  let link = url;

  emailInvData.forEach((invData, i) => {
    link += `${i === 0 ? '?' : '&'}r=${invData.roomId}`;
    if (invData.regToken) {
      link += `&t=${invData.regToken}`;
    }
    if (invData.passToken) {
      link += `&p=${invData.passToken}`;
    }
  });

  return link;
};

const generateInvitationsJson = (url, invitationDataByEmail) => {
  return Object.keys(invitationDataByEmail).map(email => ({
    email: email,
    name:
      invitationDataByEmail[email][0].firstName &&
      invitationDataByEmail[email][0].lastName
        ? invitationDataByEmail[email][0].firstName +
          ' ' +
          invitationDataByEmail[email][0].lastName
        : invitationDataByEmail[email][0].firstName ||
          invitationDataByEmail[email][0].lastName ||
          '',
    accessLink: generateAccessLink(url, invitationDataByEmail[email]),
  }));
};

const renderRowCount = count => (
  <div className="wch-rowcount">{count} lines</div>
);

const Textarea = (title, value, onChange, useRowCount = false) => {
  const [rowCount, setRowCount] = useState(0);

  return (
    <article key={title}>
      <h3>{title}</h3>
      <textarea
        defaultValue={value || ''}
        onChange={ev => {
          if (useRowCount) setRowCount(countRows(ev.target.value));
          if (onChange) onChange(ev.target.value);
        }}
      ></textarea>
      {useRowCount ? renderRowCount(rowCount) : null}
    </article>
  );
};

const AccessLinkGenerator = ({ rooms }) => {
  const [url, setUrl] = useState('');
  const [hasUrl, setHasUrl] = useState(false);
  const [lwrInvitations, setLwrInvitations] = useState({});
  const [hasLwr, setHasLwr] = useState(false);
  const [invitationsOut, setInvitationsOut] = useState({
    csv: '',
    jsonStr: '',
  });
  const [hasWcf, setHasWcf] = useState(false);

  const livewebinarTextareas = rooms.map(room =>
    Textarea(
      room.name,
      '',
      invitationCsv => {
        setLwrInvitations({
          ...lwrInvitations,
          [room.livewebinarId]:
            'email,firstname,lastname,lwrlink\n' + invitationCsv,
        });
        setHasLwr(true);
      },
      true
    )
  );

  const step4 = hasWcf ? (
    <Message>
      <h2>4. Copy Output</h2>
      <p>
        Select the format of generated access links you need (CSV / JSON). One
        recipient gets a single access link for all rooms.
      </p>
      <div className="wch-accesslinkgenerator-inputs">
        <article>
          <h3>CSV</h3>
          <pre>{invitationsOut.csv}</pre>
        </article>
        <article>
          <h3>JSON</h3>
          <pre>{JSON.stringify(invitationsOut.json)}</pre>
        </article>
      </div>
    </Message>
  ) : null;

  const step3 = hasLwr ? (
    <Message>
      <h2>3. Generate CSV With Access Links</h2>
      <Button
        onClick={() => {
          const json = Object.keys(lwrInvitations).length
            ? generateInvitationsJson(
                url,
                combineLwrInvitationsToJson(lwrInvitations)
              )
            : null;

          if (json) {
            setInvitationsOut({
              csv: jsonCSV(json),
              json: JSON.stringify(json),
            });
            setHasWcf(true);
          }
        }}
      >
        Generate CSV and JSON
      </Button>
    </Message>
  ) : null;

  const step2 = hasUrl ? (
    <Message>
      <h2>2. Paste Livewebinar CSV</h2>
      <p>Paste CSV generated in Livewebinar for each room. Line format:</p>
      <pre>
        mail@example.com,Firstname,Lastname,https://example.com/#crypticlivewebinarlink
      </pre>
      <div className="wch-accesslinkgenerator-inputs">
        {livewebinarTextareas}
      </div>
    </Message>
  ) : null;

  const step1 = (
    <Message>
      <h2>1. Set Target URL</h2>
      <p>Define the URL at which your WebConfHub will be available.</p>
      <input
        type="text"
        value={url}
        onChange={ev => {
          setUrl(ev.target.value);
          setHasUrl(true);
        }}
      />
    </Message>
  );

  return [
    <header key="header" className="wch-main-header">
      <h1>Generate WebConfHub Access Links</h1>
    </header>,
    <section key="content" id="wch-accesslinkgenerator">
      {step1}
      {step2}
      {step3}
      {step4}
    </section>,
  ];
};

const mapStateToProps = (state, ownProps) => {
  return {
    rooms: [...state.config.rooms],
  };
};

export default withRouter(connect(mapStateToProps)(AccessLinkGenerator));
