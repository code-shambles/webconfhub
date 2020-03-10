import React from 'react';

import './Button.less';

const Button = ({ ghost, type, disabled, children, onClick }) => {
  let className = 'wch-btn';

  if (ghost) {
    className += ' wch-btn-ghost';
  }

  switch (type) {
    case 'black':
      className += ' wch-btn-black';
      break;
    case 'success':
      className += ' wch-btn-success';
      break;
    case 'warning':
      className += ' wch-btn-warning';
      break;
    case 'danger':
      className += ' wch-btn-danger';
      break;
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      <div className="wch-btn-content">{children}</div>
    </button>
  );
};

export default Button;
