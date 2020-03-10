import React from 'react';

import './Room.less';

const Room = ({ currentRoom }) => {

  return (
    <section className="wch-room">
      {currentRoom.name}
    </section>
  )
};

export default Room;