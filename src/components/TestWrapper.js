import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import nodeFetch from 'node-fetch';

import { requestMiddleware } from 'Middlewares';
import createFetch from '../createFetch';
import App from './App';

const fetch = createFetch(nodeFetch, {
  baseUrl: __CONFIG__.API_GATEWAY,
});

export default function TestWrapper({ children, storeData }) {
  const middlewares = [thunk.withExtraArgument({ fetch }), requestMiddleware];
  const mockStore = configureStore(middlewares);

  const initialState = storeData || {};
  const store = mockStore(initialState);

  return (
    <App
      context={{
        fetch: () => {},
        pathname: '',
      }}
      insertCss={() => {}}
      store={store}
    >
      {React.Children.only(children)}
    </App>
  );
}

TestWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  storeData: PropTypes.any,
};

TestWrapper.defaultProps = {
  storeData: {},
};
