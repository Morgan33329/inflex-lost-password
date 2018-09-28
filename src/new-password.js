import {
    show,
    save
} from "./middleware/new-password";

export function newPasswordMiddleware (type, options, middlewares) {
    switch (type) {
        case 'show':
            return show(options, middlewares);
        case 'save':
            return save(options, middlewares);
        default:
            console.log('Invalid new password middleware type');
    }
}