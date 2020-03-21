import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { settleRegistration } from '../../../redux/actions';

import { Button, Message, Spinner } from '../../';

import './HomePage.less';

const userHasRoom = (room, invitations) => {
  return invitations && !!invitations[room.livewebinarId];
};

const renderRegistrations = (rooms, invitations) => {
  if (Array.isArray(rooms)) {
    const messages = rooms.map(room => {
      if (invitations[room.livewebinarId]) {
        switch (invitations[room.livewebinarId].registrationStatus) {
          case 'fresh': {
            return (
              <Message key={room.id}>
                {' '}
                <Spinner /> Registering you for room{' '}
                <strong>{room.name}</strong>...
              </Message>
            );
          }
          case 'success': {
            return (
              <Message
                key={room.id}
                type="success"
                doom={{
                  ttl: 5000,
                  onDeath: () =>
                    settleRegistration(room.livewebinarId, invitations),
                }}
              >
                <i className="lni lni-checkmark-circle"></i> Registration for
                room <strong>{room.name}</strong> successful!
              </Message>
            );
          }
          case 'error': {
            return (
              <Message key={room.id} type="error">
                <i className="lni lni-warning"></i> Error registering you for
                room <strong>{room.name}</strong>! Please reload the page or try
                again later.
              </Message>
            );
          }
          case 'settled':
          default: {
            return null;
          }
        }
      } else {
        return null;
      }
    });

    return messages ? (
      <section className="wch-registration">{messages}</section>
    ) : null;
  }
};

const renderRooms = (rooms, invitations) =>
  Array.isArray(rooms) ? (
    <ul>
      {rooms.map(room =>
        userHasRoom(room, invitations) ? (
          <li
            key={room.id}
            className={`wch-room-tile wch-room-tile-${room.id}`}
          >
            <Link to={`/room/${room.id}`}>
              <i
                className={`lni lni-${
                  room.type === 'breakout' ? 'users' : 'display-alt'
                }`}
              ></i>
              <h3>{room.name}</h3>
              <p>{room.description}</p>
              <Button type="black">
                ENTER <i className="lni lni-angle-double-right"></i>
              </Button>
            </Link>
          </li>
        ) : null
      )}
    </ul>
  ) : (
    <Message type="error">Config error: No streaming rooms found!</Message>
  );

const renderZoomRooms = (rooms, invitations) => (
  <ul>
    <li className={`wch-room-tile`}>
      <a href="https://sap-se.zoom.com/j/7450845795" target="_blank">
        <i className={`lni lni-display-alt`}></i>
        <h3>Saturn</h3>
        <p>Our track Saturn on Zoom!</p>
        <Button type="black">
          ENTER <i className="lni lni-angle-double-right"></i>
        </Button>
      </a>
    </li>
  </ul>
);

const HomePage = ({ baseConfig, rooms, invitations }) => {
  return (
    <main id="wch-home" className="wch-main">
      <section className="wch-welcome">
        <h1>{baseConfig.name}</h1>
        <pre>{baseConfig.welcome}</pre>
      </section>
      {renderRegistrations(rooms, invitations)}
      <section className="wch-rooms">
        <h2>Join us on Zoom</h2>
        {renderZoomRooms()}
      </section>
    </main>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    app: { ...state.app },
    baseConfig: { ...state.config.baseConfig },
    invitations: { ...state.invitations },
    rooms: [...state.config.rooms],
  };
};

export default connect(mapStateToProps, { settleRegistration })(HomePage);
