import React, { useEffect, useState } from 'react';

import './Message.less';

const Message = ({ type, doom, children }) => {
  let className = 'wch-message';
  let life;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (doom) {
      life = setTimeout(() => {
        setHidden(true);
        doom.onDeath();
      }, doom.ttl);
    }
    return () => {
      doom && doom.onDeath();
      clearTimeout(life);
    };
  }, [doom]);

  if (type) {
    className += ` wch-${type}`;
  }

  if (hidden) {
    className += ' wch-hidden';
  }

  return <div className={className}>{children}</div>;
};

export default Message;
