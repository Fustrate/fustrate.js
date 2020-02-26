import axios from 'axios';
import { ErrorFlash } from './components/flash';
// import { addDebugData } from './debug';

// Supports: Internet Explorer 11
require('core-js/features/promise');

const token = document.querySelector('[name="csrf-token"]') || { content: 'no-csrf-token' };

const instance = axios.create({
  headers: {
    common: {
      'X-CSRF-Token': token.content,
    },
  },
  responseType: 'json',
});

instance.interceptors.request.use((config) => {
  // addDebugData({
  //   method: config.method,
  //   url: config.url,
  //   data: config.data,
  // });

  return config;
}, (error) => Promise.reject(error));

// The interceptor only handles basic 401 errors and error responses - it will still throw so that
// more involved error handling can happen later.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // addDebugData({
    //   error,
    //   response: error.response,
    //   keys: Object.keys(error),
    // });

    const { data, status } = error.response;

    if (status === 401) {
      // eslint-disable-next-line no-alert
      window.alert(`
      You are not currently logged in. Please refresh the page and try performing this action again.
      To prevent this in the future, check the "Remember Me" box when logging in.`);
    } else if (data && data.errors) {
      data.errors.forEach((message) => {
        ErrorFlash.show(message);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('Unhandled interception', error.response);
    }

    return Promise.reject(error);
  },
);

export const when = (...requests) => new Promise((resolve) => {
  axios.all(requests).then(
    axios.spread((...responses) => {
      resolve(...responses);
    }),
  );
});

export const getCurrentPageJson = () => {
  const pathname = window.location.pathname.replace(/\/+$/, '');

  return instance.get(`${pathname}.json${window.location.search}`);
};

export default instance;
