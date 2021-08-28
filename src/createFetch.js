import { omit } from 'Utils';

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */

function createFetch(fetch, { baseUrl, cookie }) {
  const defaults = {
    method: 'GET',
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'same-origin' : 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : null),
    },
  };

  return (url, options = {}) =>
    fetch(`${options.baseUrl || baseUrl}${url}`, {
      ...defaults,
      ...options,
      headers: {
        ...omit(
          defaults.headers,
          options.body instanceof FormData ? ['Content-Type'] : []
        ),
        ...options.headers,
      },
    });
}

export default createFetch;
