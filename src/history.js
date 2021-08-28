import { createBrowserHistory } from 'history';

// Navigation manager, e.g. history.push('/home')
// https://github.com/mjackson/history
export default __BROWSER__ && createBrowserHistory();
