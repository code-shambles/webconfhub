import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { LinkDisplay } from '../../';

import './MainNav.less';

const ROOM_ROUTE_REGEX = /\/room\/([\w\d-]*)\/?/;

const isRoomRoute = locationPath => locationPath.match(ROOM_ROUTE_REGEX);
const matchRoomRoute = (roomId, locationPath) =>
  locationPath.indexOf(`/room/${roomId}`) !== -1;

const getCurrentRoomId = locationPath => ROOM_ROUTE_REGEX.exec(locationPath)[1];

const userHasRoom = (room, invitations) => {
  return invitations && !!invitations[room.livewebinarId];
};

const renderRoomItemContent = room => [
  <i
    key="icon"
    className={`lni lni-${room.type === 'breakout' ? 'users' : 'display-alt'}`}
  ></i>,
  room.name,
  <span key="label" className="wch-navlink-room-label">
    {room.type === 'breakout' ? 'Breakout' : 'Track'}
  </span>,
];

const renderRoomList = (rooms, onClick, invitations) => {
  let list = null;

  if (Array.isArray(rooms) && rooms.length) {
    list = (
      <ul className={`wch-${rooms[0].type}-rooms`}>
        {rooms.map(room => {
          let item = null;
          if (userHasRoom(room, invitations)) {
            item = (
              <li key={room.id}>
                <NavLink
                  to={`/room/${room.id}`}
                  className={`wch-navlink wch-navlink-room wch-navlink-room-${room.id}`}
                  activeClassName="wch-active"
                  onClick={onClick}
                  title={room.description}
                >
                  {renderRoomItemContent(room)}
                </NavLink>
              </li>
            );
          }
          return item;
        })}
      </ul>
    );
  }

  return list;
};

const renderLayerList = (layerLinks, locationPath, onClick) =>
  Array.isArray(layerLinks) && layerLinks.length ? (
    <ul className="wch-layer-links">
      {layerLinks.map(link => (
        <li key={link.id}>
          <NavLink
            exact
            to={`${
              isRoomRoute(locationPath)
                ? `/room/${getCurrentRoomId(locationPath)}`
                : ''
            }/layer/${link.id}`}
            className={`wch-navlink wch-navlink-layer wch-navlink-layer-${link.id}`}
            activeClassName="wch-active"
            onClick={onClick}
          >
            {link.text}
            <i className="lni lni-angle-double-down"></i>
          </NavLink>
        </li>
      ))}
    </ul>
  ) : null;

const renderExternalList = (externalLinks, externalLinksOpen, onClick) =>
  Array.isArray(externalLinks) && externalLinks.length ? (
    <div
      className={`wch-navlink wch-external-links${
        externalLinksOpen ? ' wch-external-links-open' : ''
      }`}
    >
      <button
        className="wch-navlink wch-collapse-header"
        onClick={() => {
          onClick();
        }}
      >
        Links
      </button>
      <ul>
        {externalLinks.map((link, i) => (
          <li key={i}>
            <a
              className={`wch-navlink wch-navlink-external`}
              href={link.href}
              title={link.title}
              target="_blank"
              onClick={onClick}
            >
              {link.text}
              <i className="lni lni-arrow-top-right"></i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  ) : null;

const renderRoomName = (rooms, locationPath) => {
  let currentRoom;
  if (Array.isArray(rooms) && rooms.length) {
    rooms.forEach(room => {
      if (matchRoomRoute(room.id, locationPath)) {
        currentRoom = room;
      }
    });
  }
  return currentRoom ? (
    <div
      className={`wch-navlink wch-navlink-room wch-navlink-room-${currentRoom.id} wch-room-display`}
    >
      {renderRoomItemContent(currentRoom)}
    </div>
  ) : null;
};

const MainNav = ({ branding, mainMenu, invitations, rooms, locationPath }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [externalLinksOpen, setExternalLinksOpen] = useState(false);

  return (
    <header id="wch-header">
      <NavLink
        to="/"
        title={branding.logo.title}
        id="wch-logo-link"
        onClick={() => setMenuOpen(false)}
      >
        <img id="wch-logo" src={branding.logo.src} alt={branding.logo.alt} />
      </NavLink>

      {renderRoomName(rooms, locationPath)}

      <nav className={menuOpen ? 'wch-menu-open' : null}>
        <button id="wch-burger">
          <i
            className={`lni lni-${menuOpen ? 'close' : 'menu'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          ></i>
        </button>
        {renderRoomList(
          rooms.filter(room => room.type === 'track'),
          () => setMenuOpen(false),
          invitations
        )}
        {renderRoomList(
          rooms.filter(room => room.type === 'breakout'),
          () => setMenuOpen(false),
          invitations
        )}

        {renderLayerList(mainMenu.layerLinks, locationPath, () =>
          setMenuOpen(false)
        )}
        {renderExternalList(mainMenu.externalLinks, externalLinksOpen, () => {
          setMenuOpen(false);
          setExternalLinksOpen(!externalLinksOpen);
        })}
        <LinkDisplay />
      </nav>
    </header>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    app: { ...state.app },
    baseConfig: { ...state.config.baseConfig },
    branding: { ...state.config.branding },
    invitations: { ...state.invitations },
    rooms: [...state.config.rooms],
    mainMenu: { ...state.config.mainMenu },
    locationPath: ownProps.location.pathname,
  };
};

export default withRouter(connect(mapStateToProps)(MainNav));
