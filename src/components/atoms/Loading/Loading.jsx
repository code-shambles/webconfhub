import React from 'react';

import './Loading.less';

const Loading = ({ fontSize }) => {
  let style = null;

  if (fontSize) {
    style = { fontSize };
  }

  return (
    <div className="wch-loading" style={style}>
      <div>
        WebconfHub is loading<span>.</span>
      </div>
    </div>
  );
};

export default Loading;
