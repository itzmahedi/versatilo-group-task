import Cookies from 'js-cookie';

const cookieNames = ['authUser', 'access_token'];

export const startCookieMonitor = (callback, interval = 10000) => {

  const previousCookieValues = {};

  cookieNames.forEach(cookieName => {
    previousCookieValues[cookieName] = Cookies.get(cookieName);
  });

  const intervalId = setInterval(() => {
    let hasChanged = false;

    cookieNames.forEach(cookieName => {
      const currentCookieValue = Cookies.get(cookieName);

      if (currentCookieValue !== previousCookieValues[cookieName]) {
        hasChanged = true;
        callback(cookieName, currentCookieValue);
        previousCookieValues[cookieName] = currentCookieValue;
      }
    });
  }, interval);

  return intervalId;
};
