import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button } from '../../';

import './HomePage.less';

const renderRooms = rooms =>
  Array.isArray(rooms) ? (
    <ul>
      {rooms.map(room => (
        <li key={room.id}>
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
    <p className="wch-error-msg">Config error: No streaming rooms found!</p>
  );

const HomePage = ({ branding, rooms }) => {
  return (
    <main id="wch-home" className="wch-main">
      <section className="wch-welcome">
        <h1>{branding.name}</h1>
        <h3>{branding.welcome}</h3>
      </section>
      <section className="wch-rooms">
        <h2>Streaming Rooms</h2>
        {renderRooms(rooms)}
      </section>
    </main>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    branding: { ...state.config.branding },
    rooms: [...state.config.rooms],
  };
};

export default connect(mapStateToProps)(HomePage);
