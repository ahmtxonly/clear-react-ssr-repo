import { nonCacheableReducers, HTTP_REQUEST, LOGOUT_SUCCESS } from 'Constants';
import { refreshToken } from 'Actions';

const needsAccessToken = url => !url.startsWith('/oauth-manager/users/login');

export default ({ dispatch, getState }) =>
  next =>
  async ({ payload = {}, type }) => {
    const {
      baseUrl,
      body = null,
      fetch,
      headers = {},
      label,
      method,
      reducer,
      transformData = data => data,
      callBack,
      errorHandler,
      url,
    } = payload || {};

    // skip loading on browser if the data is already fetched on server
    if (__BROWSER__ && !nonCacheableReducers.includes(reducer)) {
      const isAlreadyFetched = getState()[reducer]?.isFetchedOnServer;

      if (isAlreadyFetched) {
        return;
      }
    }

    next({ payload, type });

    if (type !== HTTP_REQUEST) {
      return;
    }

    const { isAuthenticated } = getState().auth || {};

    if (isAuthenticated && needsAccessToken(url)) {
      const userData = getState().auth.data;
      headers['X-Auth-Token'] = userData.accessToken;
    }

    next({
      type: `${label}_REQUEST`,
    });

    try {
      const res = await fetch(url, { baseUrl, method, headers, body });
      const contentType = res.headers.get('Content-Type');
      const data = contentType?.includes('application/json')
        ? await res.json()
        : {};

      if (res.status >= 400) {
        // eslint-disable-next-line no-throw-literal
        throw { ...data, response: { status: res.status } };
      }

      // eslint-disable-next-line consistent-return
      next({
        type: `${label}_SUCCESS`,
        payload: transformData(data),
      });

      if (typeof callBack === 'function') {
        callBack(data);
      }
    } catch (error) {
      console.error('error', error?.message);

      if (error?.response?.status === 401) {
        const hasRefreshToken = getState().auth.data.refreshToken;

        // try to renew access token if url is not related with login or refresh token
        if (hasRefreshToken && needsAccessToken(url)) {
          const currentAccessToken = getState().auth.data.accessToken;
          await dispatch(refreshToken());
          const newAccessToken = getState().auth.data.accessToken;

          // replay the request which was erroneous if we have changed the accessToken
          if (newAccessToken !== currentAccessToken) {
            await dispatch({ type, payload });
          }
        } else {
          dispatch({ type: LOGOUT_SUCCESS });
        }
      }

      const enhancedError = {
        ...error,
        message: 'messagesssx',
      };

      if (typeof errorHandler === 'function') {
        errorHandler(enhancedError);
      }

      // eslint-disable-next-line consistent-return
      return next({
        type: `${label}_FAILURE`,
        payload: enhancedError,
      });
    }
  };
