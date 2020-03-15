import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './LinkDisplay.less';

const LinkDisplay = ({ baseConfig, invitations }) => {
  let link = `${baseConfig.url}${baseConfig.baseHref}`;

  const [linkOpen, setLinkOpen] = useState(false);

  if (invitations && typeof invitations === 'object') {
    Object.keys(invitations).forEach((livewebinarRoomId, i) => {
      const invitation = invitations[livewebinarRoomId];

      link += `${i === 0 ? '?' : '&'}r=${livewebinarRoomId}`;
      if (invitation.regToken) {
        link += `&t=${invitation.regToken}`;
      }
      if (invitation.passToken) {
        link += `&p=${invitation.passToken}`;
      }
    });
  }

  return (
    <div
      id="wch-link-display"
      className={linkOpen ? 'wch-display-link-open' : null}
    >
      <button
        onClick={() => {
          setLinkOpen(!linkOpen);
        }}
        title="View your access link"
      >
        <i className="lni lni-link"></i>
      </button>
      <input value={link} readOnly type="text" />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    baseConfig: { ...state.config.baseConfig },
    invitations: { ...state.invitations },
  };
};

export default connect(mapStateToProps)(LinkDisplay);
