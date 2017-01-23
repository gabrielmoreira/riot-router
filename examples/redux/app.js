(function() {

  /**
   * App Actions
   **/
  function userActions(context) {
    var dispatch = context.dispatch;
    var getState = context.getState;
    var notifyError = context.utils.notifyError;
    var post = context.utils.post;
    var get = context.utils.get;
    var url = context.utils.url;

    function loginWithEmail(email, password) {
      post(url.login, {
          email: email,
          password: password
      }).then(function(response) {
        dispatch('USER__LOGIN_SUCCESS', {email: email, token: response.token});
      }).catch(function(e) {
        dispatch('USER__LOGIN_FAILED', {email: email, cause: e});
        notifyError({message: 'Login Failed', error: e});
      });
    }

    function logout() {
      dispatch('USER__LOGOUT');
    }

    function list() {
      get(url.list, {
        page: 1
      }).then(function(response) {
        dispatch('USERS__LIST', {users: response.data});
      })
    }

    function load(id) {
      var users = getState().users;
      if (users.usersById[id])
        return;
      list();
    }

    return {
      loginWithEmail: loginWithEmail,
      logout: logout,
      list: list,
      load: load
    }
  }

  /**
   * App Reducer
   **/
  function userReducer(state, action) {
    if (!state) state = {logged: false};
    if (action.type === 'USER__LOGIN_SUCCESS') {
      return {logged: true, email: action.payload.email, token: action.payload.token};
    } else if (action.type === 'USER__LOGOUT' || action.type === 'USER__LOGIN_FAILED') {
      return {logged: false};
    }
    return state;
  }

  function usersReducer(state, action) {
    if (!state) state = {users: [], usersById: {}};
    switch (action.type) {
      case 'USERS__LIST':
        return {
          users: action.payload.users, 
          usersById: _.keyBy(action.payload.users, 'id')
        };
    }
    return state;
  }

  var notificationId = 0;
  function notificationsReducer(state, action) {
    if (!state) state = [];
    if (action.type === 'NOTIFICATION__ADD') {
      var notification = action.payload;
      notification.id = ++notificationId;
      return [notification].concat(state);
    } else if (action.type === 'NOTIFICATION__DISMISS') {
      var id = action.payload.id || action.payload;
      return state.filter(function(p) {
        return !(id === p.id || action.payload === p);
      });
    }
    return state;
  }

  function loadingReducer(state, action) {
    state = state || {count: 0};
    var count = state.count;
    switch (action.type) {
      case 'LOADING__BEGIN':
        count++;
        return {active: count > 0, count: count};
      case 'LOADING__END':
        count = Math.max(--count, 0);
        return {active: count > 0, count: count};
    }
    return state;
  }

  function routerReducer(state, action) {
    state = state || {url: null};
    if (action.type === 'ROUTER__URL') {
      state = {url: action.payload.url};
    }
    return state;
  }

  /**
   * App Configuration
   **/
  window.app = CreateSimpleApp({
    state: function(context) {
      return {
        user: JSON.parse(localStorage.getItem('user') || '{}')
      }
    },
    reducers: function(context) {
      return {
        user: userReducer,
        users: usersReducer,
        loading: loadingReducer,
        notifications: notificationsReducer,
        router: routerReducer
      }
    },
    actions: function(context) {
      return {
        user: userActions(context)
      }
    },
    routes: function(context) {
      var Route = Router.Route,
        RedirectRoute = Router.RedirectRoute,
        DefaultRoute = Router.DefaultRoute;
      return [
        new Route({tag: 'app'}).routes([
          new Route({tag: 'users'}),
          new Route({tag: 'user', path:'user/:userId'}),
          new DefaultRoute({tag: 'home'})
        ]),
        new RedirectRoute({from: '', to: 'app'})
      ];
    },
    utils: function(context) {
      function appFetch(method, url, data) {
        context.dispatch('LOADING__BEGIN', {url: url});
        var req = {
          method: method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        };
        // add custom backend auth token here...
        if (method === 'POST') req.body = JSON.stringify(data);
        if (method === 'GET' && data) url = url + (url.indexOf('?') > -1 ? '&' : '?') + $.param(data);
        return window.fetch(url, req).then(function(response) {
          return response.json().then(function(data) {
            context.dispatch('LOADING__END', {url: url});
            if (response.status === 200) {
              return data;
            } else {
              var error = new Error(response.statusText);
              error.response = response;
              error.data = data;
              throw error;
            }
          });
        });
      }

      function appNotify(type, notification) {
        notification.type = type;
        return context.dispatch('NOTIFICATION__ADD', notification);
      }

      return {
        // ajax
        url: {
          login: 'https://reqres.in/api/login',
          list: 'https://reqres.in/api/users'
        },
        post: appFetch.bind(null, 'POST'),
        get: appFetch.bind(null, 'GET'),

        // notifications
        notifyError: appNotify.bind(null, 'danger'),
        notifySuccess: appNotify.bind(null, 'success'),
        notifyAlert: appNotify.bind(null, 'warning'),
        notifyInfo: appNotify.bind(null, 'info'),
        dismiss: function(notification) {
          context.dispatch('NOTIFICATION__DISMISS', notification);
        }
      };
    }
  });

  /**
   * Custom Listeners
   **/
  app.on('USER__LOGIN_SUCCESS USER__LOGOUT', function() {
    var state = app.getState();
    if (state.user.logged) {
      try {
        localStorage.setItem('user', JSON.stringify(state.user));
      } catch (e) {};

    } else {
      localStorage.removeItem('user');
    }
    router.navigateTo('/app');
  });

  router.on('route:updated', function() {
    app.dispatch('ROUTER__URL', {url: router.current.uri});
  });

  app.store.subscribe(function() {
    var state = app.getState();
    if (state.router.url !== null 
      && state.router.url !== router.current.uri) {
      router.navigateTo(state.router.url);
    }
  });
  
})();
