import sendLostPassword from "./middleware/send-lost-password";
import {
    sendLostPasswordRoute,
    showNewPasswordRoute,
    saveNewPasswordRoute
} from './route';

/**
 * Create default routes for login if we are lazy
 */
export function lostPasswordRoutes (app, version, options) {
    if (typeof version === 'object' && !options) {
        options = version;
        version = null;
    }

    options = options || {};

    sendLostPasswordRoute(app, options.sendEmail || {}, version);

    showNewPasswordRoute(app, options.showNew || {}, version);

    saveNewPasswordRoute(app, options.saveNew || {}, version);
}

export function lostPasswordMiddleware (options, middleware) {
    return sendLostPassword(options, middleware);
}