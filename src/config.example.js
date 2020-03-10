/* Copy this file as ./config.js and make your settings. Do not commit ./config.js!! */

const config = {
  /* Basic settings */
  conference: {
    /* Used as html title and on the home page */
    name: `Awesome Rockstar Conf ${new Date().getUTCFullYear()}`,
    /* Used on the home page */
    welcome: `Welcome all attendees and sponsors! We hope you'll have an awesome web conference. Check out our streaming rooms Saturn and Neptune!`,
  },
  /* Configure ione or more conference rooms */
  rooms: [
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
  ],
  /* Configure your header */
  mainMenu: {
    logo: {
      /* Use an https web URL to the logo file or a data:image/png;base64 value! */
      src:
        'data:image/png;base64,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',
      alt: 'Awesome RockstarConf logo',
      title: `Awesome Rockstar Conf ${new Date().getUTCFullYear()}`,
    },
    /* Add menu links as overlays. The content is in an iframe and layered over the webinar widget, so users can stay present */
    layerLinks: [
      {
        /* Only use lowercase letters, numbers, and the hyphen '-' as id */
        id: 'schedule',
        /* Text visible as menu item */
        text: 'Schedule',
        /* When user hovers the menu item a while */
        title: 'View schedule',
        /* This si used as the source URL for the iframe in the overlay */
        src: 'https://example.com/#schedule',
      },
      {
        id: 'coc',
        text: 'CoC',
        title: 'View Code of Conduct',
        src: 'https://example.com/#coc/',
      },
    ],
    /* Add menu links to external pages. These links are opened in a new window/tab, so the user does not lose the WebConf Hub page */
    externalLinks: [
      {
        text: 'Slack',
        title: 'Open Slack (new tab)',
        href: 'https://example.com/#slack',
      },
    ],
  },
};

export default config;
