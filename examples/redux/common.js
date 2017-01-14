function CreateSimpleApp(config) {
  var context = riot.observable();

  function register() {
    if (config.utils)
      context.utils = config.utils(context);
    if (config.reducers) {
      var initialState = null;
      if (config.state) initialState = config.state(context);
      var reducers = Redux.combineReducers(config.reducers(context));
      context.store = Redux.createStore(reducers, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
      context.getState = context.store.getState;
      context.dispatch = function(type, payload, meta) {
        var event = {type: type};
        if (payload) event.payload = payload;
        if (meta) event.meta = meta;
        context.store.dispatch(event);
        console.log(event);
        context.trigger(event.type, event.payload, event.meta, event);
      }
    }
    if (config.actions)
      context.actions = config.actions(context);
    if (config.routes)
      context.routes = config.routes(context);
  }

  function start() {
    if (context.utils) {
      riot.mixin({
        utils: context.utils
      });
    }
    if (context.store) {
      riot.mixin(RiotStateUpdater.StoreMixin(context.store));
    }
    if (context.actions) {
      riot.mixin({
        actions: context.actions
      });
    }
    riot.util.tmpl.errorHandler = function (err) {
      console.error("[WARN]", err.message + ' in ' + err.riotData.tagName) // your error logic here
    }
    riot.mount('*');
    console.log("mounted");
    if (context.routes) {
      if (Object.prototype.toString.call(context.routes) === '[object Array]')
        router.routes(context.routes);
      else
        router.route(context.routes);
      router.start();
      console.log("route started");
    }
  }

  register();
  start();

  return context;
}