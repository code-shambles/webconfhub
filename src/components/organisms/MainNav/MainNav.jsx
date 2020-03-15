import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import { LinkDisplay } from '../../';

import './MainNav.less';

const ROOM_ROUTE_REGEX = /\/room\/([\w\d-]*)\/?/;

const isRoomRoute = locationPath => locationPath.match(ROOM_ROUTE_REGEX);

const getCurrentRoomId = locationPath => ROOM_ROUTE_REGEX.exec(locationPath)[1];

const renderRoomItems = rooms =>
  Array.isArray(rooms)
    ? rooms.map(room => (
        <li key={room.id}>
          <NavLink
            to={`/room/${room.id}`}
            className={`wch-navlink wch-navlink-room wch-navlink-room-${room.id}`}
            activeClassName="wch-active"
          >
            <i className="lni lni-display-alt"></i>
            {room.name}
          </NavLink>
        </li>
      ))
    : null;

const renderLayerItems = (layerLinks, locationPath) =>
  Array.isArray(layerLinks)
    ? layerLinks.map(link => (
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
          >
            {link.text}
            <i className="lni lni-angle-double-down"></i>
          </NavLink>
        </li>
      ))
    : null;

const renderExternalItems = externalLinks =>
  Array.isArray(externalLinks)
    ? externalLinks.map((link, i) => (
        <li key={i}>
          <a
            className={`wch-navlink wch-navlink-external`}
            href={link.href}
            title={link.title}
            target="_blank"
          >
            {link.text}
            <i className="lni lni-arrow-top-right"></i>
          </a>
        </li>
      ))
    : null;

const MainNav = ({ branding, mainMenu, invitations, rooms, locationPath }) => {
  return (
    <header id="wch-header">
      <NavLink to="/" title={branding.logo.title} id="wch-logo-link">
        <img id="wch-logo" src={branding.logo.src} alt={branding.logo.alt} />
      </NavLink>
      <nav>
        <ul>
          {renderRoomItems(rooms)}
          {renderLayerItems(mainMenu.layerLinks, locationPath)}
          {renderExternalItems(mainMenu.externalLinks)}
        </ul>
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
