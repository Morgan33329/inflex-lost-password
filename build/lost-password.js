import sendLostPassword from "./middleware/send-lost-password";
import { sendLostPasswordRoute, showNewPasswordRoute, saveNewPasswordRoute } from './route';

/**
 * Create default routes for login if we are lazy
 */
export function lostPasswordRoutes(app, options) {
    options = options || {};

    sendLostPasswordRoute(app, options.sendEmail || {});

    showNewPasswordRoute(app, options.showNew || {});

    saveNewPasswordRoute(app, options.saveNew || {});
}

export function lostPasswordMiddleware(options, middleware) {
    return sendLostPassword(options, middleware);
}