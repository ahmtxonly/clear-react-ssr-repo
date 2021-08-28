import { setupServer } from 'msw/node';

import handlers from './server-handlers';

export default setupServer(...handlers);
