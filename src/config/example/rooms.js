/* Copy this file to /src/config and make your settings */

/* Configure one or more conference rooms. Use an array also for 1 room */
const rooms = [
  {
    /* Only use lowercase letters, numbers, and the hyphen '-' as id */
    id: 'andromeda',
    name: 'Andromeda',
    description:
      'Andromeda is a conference room with galactic talks the whole day!',
    /* This is the ID (also referenced to as authentication key) from your livewebinar room */
    livewebinarId: '123-456-789',
  },
  {
    /* Only use lowercase letters, numbers, and the hyphen '-' as id */
    id: 'magellan-cloud',
    name: 'Magellan Cloud',
    description:
      'Magellan Cloud is a conference room with cosmic talks the whole day!',
    /* This is the ID (also referenced to as authentication key) from your livewebinar room */
    livewebinarId: '987-654-321',
  },
];

export default rooms;
