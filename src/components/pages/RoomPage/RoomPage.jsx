import React, { memo, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';

import './RoomPage.less';

const LWR_BODY_SCRIPT_SRC =
  'https://embed.livewebinar.com/widget/wea/wea.min.js';

const roomExists = room => room && room.livewebinarId;

const renderError = room =>
  roomExists(room) ? null : (
    <p className="wch-error-msg">
      Error: The requested room <em>{room.id}</em> was not found!
    </p>
  );

const initLwrWidget = i => {
  /* partial code from livewebinar.com embedding snippet */
  (i.Widget = function(c) {
    'function' == typeof c && i.Widget.__cbs.push(c),
      i.Widget.initialized &&
        (i.Widget.__cbs.forEach(function(i) {
          i();
        }),
        (i.Widget.__cbs = []));
  }),
    (i.Widget.__cbs = []);
};

const getLwrScriptSrc = room => {
  /* partial code from livewebinar.com embedding snippet */
  const options = {
    _license_key: room.livewebinarId,
    _role_token: '',
    _registration_token: '',
    _widget_containerID: 'embedWidget',
    _widget_width: '100%',
    _widget_height: '100%',
  };

  return (
    'https://embed.livewebinar.com/em?t=' +
    options['_license_key'] +
    '&' +
    Object.keys(options)
      .reduce(function(a, k) {
        a.push(k + '=' + encodeURIComponent(options[k]));
        return a;
      }, [])
      .join('&')
  );
};

const RoomPage = ({ room }) => {
  const refContainer = useRef(null);

  useEffect(() => {
    if (roomExists(room)) {
      const script = document.createElement('script');

      script.innerText = room.livewebinarId;
      script.src = getLwrScriptSrc(room);
      script.async = true;

      refContainer.current.appendChild(script);
      initLwrWidget(window);

      return () => {
        refContainer.current.innerHTML = '';
        const lwrBodyScript = document.querySelector(
          `script[src='${LWR_BODY_SCRIPT_SRC}']`
        );
        if (lwrBodyScript) {
          document
            .querySelector(`script[src='${LWR_BODY_SCRIPT_SRC}']`)
            .remove();
        }
      };
    }
  }, [room.livewebinarId]);

  return (
    <main id="room" className="wch-main">
      <section ref={refContainer}>{renderError(room)}</section>
    </main>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    room: {
      ...state.config.rooms.find(
        room => room.id === ownProps.match.params.roomId
      ),
    },
  };
};

export default withRouter(connect(mapStateToProps)(RoomPage));
