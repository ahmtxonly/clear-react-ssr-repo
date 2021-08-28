import UniversalRouter from 'universal-router';
import routes from './routes';

export default new UniversalRouter(routes, {
  async resolveRoute(context, params) {
    if (!__BROWSER__) {
      if (context.route.loadDataOnServer) {
        await Promise.all(
          context.route
            .loadDataOnServer({
              dispatch: context.store.dispatch,
              getState: context.store.getState,
              params,
            })
            .map(item =>
              item().catch(err => {
                console.error('err', err);
              })
            )
        );
      }
    }

    // since user data is only stored on client side redux, there should be no redirection on server side
    if (__BROWSER__ && context.route.protected) {
      const { isAuthenticated } = context.store.getState().auth;

      if (!isAuthenticated) {
        return { redirect: '/giris-yap', from: context.pathname };
      }
    }

    if (typeof context.route.load === 'function') {
      return context.route
        .load()
        .then(action => action.default(context, params));
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }
    return undefined;
  },
});
