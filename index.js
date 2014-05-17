
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-render');
var view = require('co-views');
var merge = require('merge');

/**
 * Add a render() method to koa that allows
 * you to render almost any templating engine.
 *
 * Example:
 *
 *   app.use(views('./example', {
 *     html: 'underscore'
 *   }));
 *
 *   // in your route handler
 *   this.body = yield this.render('index');
 *
 * @param {String} path
 * @param {String} ext (optional)
 * @param {Object} opts (optional)
 * @return {Function} middleware
 * @api public
 */

module.exports = function (path, ext, opts) {
  debug('add render() method to `this.ctx`');
  opts = opts || {};

  if (typeof ext === 'object') opts = ext;
  else opts.ext = ext;

  // get render function
  getRender = render(path, opts);

  // middleware
  return function *views(next) {
    this.render = getRender(this.locals);

    yield next;
  }
}

/**
 * Determine `render()` function.
 *
 * @param {String} path
 * @param {Object} opts
 * @return {Generator} view
 * @api private
 */

function render (path, opts) {
  return function (middlewareLocals) {
    return function (file, locals) {
      if (opts.locals) {
        // merge global with local locals.
        locals = merge(opts.locals, locals);
      }

      if (middlewareLocals) {
        // merge middlewareLocals with local locals.
        locals = merge(middlewareLocals, locals);
      }

      console.log(locals);

      debug('render %s with locals %j and options %j', file, locals, opts);
      return view(path, opts)(file, locals);
    }
  }
}
