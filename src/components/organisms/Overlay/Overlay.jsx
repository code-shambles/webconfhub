import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import './Overlay.less';

const ROOM_ROUTE_REGEX = /\/room\/([\w\d-]*)\/?/;
const LAYER_ROUTE_REGEX = /\/layer\/([\w\d-]*)\/?/;

const isRoomRoute = locationPath => locationPath.match(ROOM_ROUTE_REGEX);
const isLayerRoute = locationPath => locationPath.match(LAYER_ROUTE_REGEX);

const getCurrentRoomId = locationPath => ROOM_ROUTE_REGEX.exec(locationPath)[1];
const getCurrentLayerId = locationPath => {
  const match = LAYER_ROUTE_REGEX.exec(locationPath);
  return match && match[1] ? match[1] : null;
};

const Overlay = ({ layerLinks, locationPath }) => {
  useEffect(() => {
    //document.title = `${htmlTitle} | WebConf Hub`;
  }, [layerLinks]);

  let content = null;

  const currentLayerId = getCurrentLayerId(locationPath);

  if (currentLayerId) {
    const currentLayerLink = layerLinks.find(
      layerLink => layerLink.id === currentLayerId
    );
    if (currentLayerLink) {
      const closePath = locationPath.replace(`/layer/${currentLayerId}`, '');

      content = (
        <aside className="wch-overlay wch-open">
          <iframe src={currentLayerLink.src}></iframe>
          <div className="wch-overlay-close" title="Close">
            <Link to={closePath}>
              <i className="lni lni-close"></i>
            </Link>
          </div>
        </aside>
      );
    }
  }

  return content;
};

const mapStateToProps = (state, ownProps) => {
  return {
    layerLinks: [...state.config.mainMenu.layerLinks],
    rooms: [...state.config.rooms],
    locationPath: ownProps.location.pathname,
  };
};

export default withRouter(connect(mapStateToProps)(Overlay));
