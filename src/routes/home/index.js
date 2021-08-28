import React from 'react';

import Home from './Home';

function action({ params }) {
  return {
    title: 'Anasayfa',
    chunks: ['home'],
    component: <Home params={params} />,
  };
}

export default action;
