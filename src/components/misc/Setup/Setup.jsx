import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const writeToDom = stylesheet => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerText = stylesheet;
  document.head.appendChild(style);
};

const createStylesheet = styles => {
  const allowedRules = {
    header: {
      bgImage: '--header-bg-image',
      bgColor: '--header-bg-color',
      menuLinkColor: '--menu-link-color',
      menuLinkColorActive: '--menu-link-color-active',
    },
    page: {
      bgColor: '--main-bg-color',
      textColor: '--main-color',
      linkColor: '--link-color',
      linkColorActive: '--link-color-active',
      errorColor: '--error-color',
      boxBgColor: '--box-bg-color',
      overlayBgColor: '--overlay-bg-color',
    },
    rooms: ['mainColor', 'mainColorActive', 'accentColor1', 'accentColor2'],
  };

  let stylesheet = '';

  if (styles && typeof styles === 'object') {
    Object.keys(styles).forEach(ruleGroupName => {
      if (typeof styles[ruleGroupName] === 'object') {
        const ruleGroup = styles[ruleGroupName];
        const allowedRuleGroup = allowedRules[ruleGroupName];

        if (allowedRuleGroup) {
          if (ruleGroupName === 'rooms') {
            Object.keys(ruleGroup).forEach(roomName => {
              const roomRuleGroup = ruleGroup[roomName];
              let roomRulesHeader = '';
              let roomRulesHeaderActive = '';
              let roomRulesHome = '';
              let roomRulesHomeActive = '';
              let roomRulesHomeAccent = '';

              Object.keys(roomRuleGroup).forEach(ruleName => {
                if (allowedRuleGroup.indexOf(ruleName) !== -1) {
                  const ruleValue = roomRuleGroup[ruleName];
                  switch (ruleName) {
                    case 'mainColor': {
                      roomRulesHeader += `color: ${ruleValue}; `;
                      roomRulesHeader += `border-color: ${ruleValue}; `;
                      roomRulesHeaderActive += `color: var(--header-bg-color); `;
                      roomRulesHeaderActive += `background-color: ${ruleValue}; `;
                      roomRulesHome += `background-color: ${ruleValue};`;
                      break;
                    }
                    case 'mainColorActive': {
                      roomRulesHomeActive += `background-color: ${ruleValue};`;
                      break;
                    }
                    case 'accentColor1': {
                      roomRulesHome += `color: ${ruleValue};`;
                      break;
                    }
                    case 'accentColor2': {
                      roomRulesHomeAccent += `color: ${ruleValue};`;
                      break;
                    }
                    default:
                      break;
                  }
                }
              });

              if (roomRulesHeader) {
                stylesheet += `#wch-header .wch-navlink.wch-navlink-room.wch-navlink-room-${roomName} { ${roomRulesHeader} } `;
              }
              if (roomRulesHeaderActive) {
                stylesheet +=
                  `#wch-header .wch-navlink.wch-navlink-room.wch-navlink-room-${roomName}.wch-active, ` +
                  `#wch-header .wch-navlink.wch-navlink-room.wch-navlink-room-${roomName}:hover, ` +
                  `#wch-header .wch-navlink.wch-navlink-room.wch-navlink-room-${roomName}:focus { ${roomRulesHeaderActive} } `;
              }
              if (roomRulesHome) {
                stylesheet += `main#wch-home .wch-rooms ul li.wch-room-tile.wch-room-tile-${roomName} a { ${roomRulesHome} } `;
              }
              if (roomRulesHomeActive) {
                stylesheet +=
                  `main#wch-home .wch-rooms ul li.wch-room-tile.wch-room-tile-${roomName} a:hover, ` +
                  `main#wch-home .wch-rooms ul li.wch-room-tile.wch-room-tile-${roomName} a:focus { ${roomRulesHomeActive} }`;
              }
              if (roomRulesHomeAccent) {
                stylesheet +=
                  `main#wch-home .wch-rooms ul li.wch-room-tile.wch-room-tile-${roomName} a>i { ${roomRulesHomeAccent} } ` +
                  `main#wch-home .wch-rooms ul li.wch-room-tile.wch-room-tile-${roomName} a>h3 { ${roomRulesHomeAccent} } `;
              }
            });
          } else {
            let cssVars = '';
            Object.keys(ruleGroup).forEach(ruleName => {
              if (allowedRuleGroup[ruleName]) {
                cssVars += `${allowedRuleGroup[ruleName]}: ${ruleGroup[ruleName]}; `;
              }
            });
            if (cssVars) {
              stylesheet += `:root {${cssVars}}`;
            }
          }
        }
      }
    });
  }

  return stylesheet;
};

const Setup = ({ branding }) => {
  useEffect(() => {
    writeToDom(createStylesheet(branding.styles));
  }, [branding]);
  return <p></p>;
};

const mapStateToProps = state => {
  return {
    branding: { ...state.config.branding },
  };
};

export default connect(mapStateToProps)(Setup);
