/* Copy this file to /src/config and make your settings */

/* Configure your menu items */
const mainMenu = {
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
};

export default mainMenu;
