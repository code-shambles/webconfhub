import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { settleRegistration } from '../../../redux/actions';

import { Button, Message, Spinner } from '../../';

import './HomePage.less';

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

const renderRooms = rooms =>
  Array.isArray(rooms) ? (
    <ul>
      {rooms.map(room => (
        <li key={room.id} className={`wch-room-tile wch-room-tile-${room.id}`}>
          <Link to={`/room/${room.id}`}>
            <i className="lni lni-display-alt"></i>
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <Button type="black">
              ENTER <i className="lni lni-angle-double-right"></i>
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <Message type="error">Config error: No streaming rooms found!</Message>
  );

const HomePage = ({ baseConfig, rooms, invitations }) => {
  return (
    <main id="wch-home" className="wch-main">
      <section className="wch-welcome">
        <h1>{baseConfig.name}</h1>
        <h3>{baseConfig.welcome}</h3>
      </section>
      {renderRegistrations(rooms, invitations)}
      <section className="wch-rooms">
        <h2>Streaming Rooms</h2>
        {renderRooms(rooms)}
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
