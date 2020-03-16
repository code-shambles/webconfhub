import LocalStorage from './LocalStorage';

const LS_KEY = 'wch-invitations';

const getLsInvitations = () => {
  return LocalStorage.getJson(LS_KEY);
};

const setLsInvitations = invitations => {
  LocalStorage.set(LS_KEY, invitations);
};

/**
 * Generic parsing of location.search to object,
 * supporting reoccurring parameters as arrays,
 * not supporting array parameters like arr[]
 */
const parseLocationSearch = () => {
  const paramObj = {};

  if (window.location.search) {
    const query = window.location.search.replace(/^\?/, '').split('&');
    const trackParams = [];

    for (let i = 0; i < query.length; i++) {
      const tuple = query[i].split('=');
      const name = tuple[0];
      const value = tuple[1];
      if (trackParams.indexOf(name) !== -1) {
        if (typeof paramObj[name] === 'string') {
          paramObj[name] = [paramObj[name]];
        }
        paramObj[name].push(value);
      } else {
        paramObj[name] = value;
        trackParams.push(name);
      }
    }
  }

  return paramObj;
};

/**
 * Generate an invitation object from URL params
 * @param {*} regToken
 * @param {*} passToken
 */
const createUrlInvitation = (regToken, passToken) => {
  const invitation = { registrationStatus: 'fresh' };

  if (regToken) invitation.regToken = regToken;
  if (passToken) invitation.passToken = passToken;

  return invitation;
};

/**
 * Extract valid parameters from location query
 */
const getUrlInvitations = () => {
  const params = parseLocationSearch();
  const urlInvitations = {};

  if (params.r) {
    const livewebinarRoomIds =
      typeof params.r === 'string' ? [params.r] : params.r;
    const regTokens = params.t
      ? typeof params.t === 'string'
        ? [params.t]
        : params.t
      : [];
    const passTokens = params.p
      ? typeof params.p === 'string'
        ? [params.p]
        : params.p
      : [];

    for (let i = 0; i < livewebinarRoomIds.length; i++) {
      urlInvitations[livewebinarRoomIds[i]] = {
        ...createUrlInvitation(regTokens[i], passTokens[i]),
      };
    }
  }

  return {
    urlInvitations,
    forceFromUrl: params.force && params.force === 'withMe',
  };
};

/**
 * Combine invitations from URL and LocalStorage
 */
const combineInvitations = () => {
  const { urlInvitations, forceFromUrl } = getUrlInvitations();
  const lsInvitations = getLsInvitations();
  let combinedInvitations = {};

  if (forceFromUrl) {
    combinedInvitations = urlInvitations;
  } else {
    if (lsInvitations) {
      // primer
      combinedInvitations = { ...lsInvitations };
    }
    if (urlInvitations) {
      // extend lsInvitations by urlInvitations (not overriding)
      combinedInvitations = { ...urlInvitations, ...combinedInvitations };
    }
  }

  return combinedInvitations;
};

/**
 * Gather data about invitations from URL, localStorage
 * TODO gather also from server
 */
const setupInvitations = () => {
  const combinedInvitations = combineInvitations();

  setLsInvitations(combinedInvitations);

  return combinedInvitations;
};

/**
 * Flag an invitation's registrationStatus as successful
 * and store in LocalStorage
 * @param {*} livewebinarRoomId
 * @param {*} invitations
 */
const burnInvitation = (livewebinarRoomId, invitation) => {
  const lsInvitations = getLsInvitations();
  lsInvitations[livewebinarRoomId] = invitation;
  setLsInvitations(lsInvitations);

  return invitation;
};

/**
 * Execute registration for a room by loading an invisible iframe
 * @param {*} livewebinarRoomId
 * @param {*} invitation
 */
const performRegistration = (livewebinarRoomId, invitation) => {
  const iframe = document.createElement('iframe');
  const timeout = 15000;
  const intervalStep = 50;
  let timePassed = 0;
  let iframeLoaded = false;
  let src = `https://app.livewebinar.com/${livewebinarRoomId}`;

  if (invitation) {
    if (invitation.regToken) {
      src += `/p/${invitation.regToken}`;
    }
    if (invitation.passToken) {
      src += `?_password_token=${invitation.passToken}`;
    }
  }

  iframe.src = src;
  iframe.className = 'wch-registration-hidden';
  //document.body.appendChild(iframe);
  iframe.onload = () => {
    iframeLoaded = true;
  };

  return new Promise(
    resolve => {
      const interval = setInterval(function() {
        if (iframeLoaded || timePassed > timeout) {
          if (iframeLoaded) {
            invitation.registrationStatus = 'success';
            invitation = burnInvitation(livewebinarRoomId, invitation);
          } else {
            invitation.registrationStatus = 'error';
          }

          iframe.remove();
          resolve({ livewebinarRoomId, invitation });
          clearInterval(interval);
        } else {
          timePassed += intervalStep;
        }
      }, intervalStep);
    },
    reject => {
      invitation.registrationStatus = 'error';
      reject({ livewebinarRoomId, invitation });
    }
  );
};

/**
 * Replace performRegistration in case a registration is needed
 * @param {*} livewebinarRoomId
 * @param {*} invitation
 */
const skipRegistration = (livewebinarRoomId, invitation) => {
  return new Promise(
    resolve => resolve({ livewebinarRoomId, invitation }),
    reject => reject({ livewebinarRoomId, invitation })
  );
};

/**
 * Do or do not invoke registration process for given invitations,
 * then update them with the according status
 */
const performRegistrations = invitations => {
  const registrationPromises = [];

  if (typeof invitations === 'object') {
    Object.keys(invitations).forEach(livewebinarRoomId => {
      const inv = invitations[livewebinarRoomId];
      if (
        inv.registrationStatus === 'fresh' ||
        inv.registrationStatus === 'error'
      ) {
        registrationPromises.push(performRegistration(livewebinarRoomId, inv));
      } else {
        registrationPromises.push(skipRegistration(livewebinarRoomId, inv));
      }
    });
  }

  return Promise.allSettled(registrationPromises).then(results => {
    const invitations = {};
    results.forEach(
      result =>
        (invitations[result.value.livewebinarRoomId] = result.value.invitation)
    );

    return invitations;
  });
};

/**
 * Flag an invitation's registrationStatus as settled
 * and store in LocalStorage
 * @param {*} livewebinarRoomId
 * @param {*} invitations
 */
const settleRegistration = (livewebinarRoomId, invitations) => {
  const updatedInvitations = { ...invitations };

  if (updatedInvitations[livewebinarRoomId]) {
    updatedInvitations[livewebinarRoomId].registrationStatus = 'settled';
    setLsInvitations(updatedInvitations);
  }
};

export const handleInvitations = () => setupInvitations();

export const handleRegistrations = invitations =>
  performRegistrations(invitations).then(response => response);

export const handleSettleRegistration = (livewebinarRoomId, invitations) =>
  settleRegistration(livewebinarRoomId, invitations);
