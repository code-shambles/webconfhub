import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Loading } from '../../';

import './RoomPage.less';

const roomExists = room => room && room.livewebinarId;

const renderError = room =>
  roomExists(room) ? null : (
    <p className="wch-error-msg">
      Error: The requested room <em>{room.id}</em> was not found!
    </p>
  );

const renderLwrIframe = (loading, registered, invitation, room) => {
  let src = `https://app.livewebinar.com/${room.livewebinarId}`;

  if (invitation) {
    if (invitation.regToken) src += `/p/${invitation.regToken}`;
    if (
      invitation.passToken &&
      invitation.registrationStatus !== 'success' &&
      invitation.registrationStatus !== 'settled'
    ) {
      src += `?_password_token=${invitation.passToken}`;
    }
  }

  //return registered && !loading ? <pre>{src}</pre> : <Loading />;
  return registered && !loading ? (
    <iframe src={src} allowFullScreen></iframe>
  ) : (
    <Loading />
  );
};

const RoomPage = ({ loading, registered, invitations, room }) => {
  const invitation = invitations[room.livewebinarId];

  return (
    <main id="wch-room" className="wch-main">
      {renderLwrIframe(loading, registered, invitation, room)}
      {renderError(room)}
    </main>
  );
};

const mapStateToProps = (state, ownProps) => {
  const roomId = ownProps.match.params.roomId;

  return {
    loading: state.app.loading,
    registered: state.app.registered,
    invitations: { ...state.invitations },
    room: {
      ...state.config.rooms.find(room => room.id === roomId),
    },
  };
};

export default withRouter(connect(mapStateToProps)(RoomPage));
