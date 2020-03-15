/* Copy this file to /src/config and make your settings */

/* Configure one or more conference rooms. Use an array also for 1 room */
const rooms = [
  {
    /* Only use lowercase letters, numbers, and the hyphen '-' as id */
    id: 'andromeda',
    name: 'Andromeda',
    description:
      'Andromeda is a conference room with cosmic talks the whole day!',
    /* This is the ID (also referred to as authentication key) from your livewebinar room */
    livewebinarId: '999-888-777',
  },
  {
    /* Only use lowercase letters, numbers, and the hyphen '-' as id */
    id: 'magellan-cloud',
    name: 'Magellan Cloud',
    description:
      'Magellan Cloud is a conference room with galactic talks the whole day!',
    /* This is the ID (also referred to as authentication key) from your livewebinar room */
    livewebinarId: '111-222-333',
  },
];

export default rooms;
