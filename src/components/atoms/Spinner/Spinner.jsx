import React from 'react';

import './Spinner.less';

const Spinner = ({ fontSize }) => {
  let style = null;

  if (fontSize) {
    style = { fontSize };
  }

  return (
    <span className="wch-spinner" style={style}>
      <i className="lni lni-spiner-solid"></i>
    </span>
  );
};

export default Spinner;
