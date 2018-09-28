import { lostPasswordMiddleware } from './lost-password';
import { newPasswordMiddleware } from './new-password';

var sendSuccess = function (req, res) {
    res.json({
        'error' : false
    });
}

export function sendLostPasswordRoute (app, options) {
    options = options || {};

    app.post('/api/lost-password', lostPasswordMiddleware({
        'email' : {
            'view' : options.view || 'lost-password'
        }
    }), options.action || sendSuccess);
}

var newPassword = function (req, res) {
    res.render('new-password', {
        code : req.query['code'] || '0'
    });
}

export function showNewPasswordRoute (app, options) {
    options = options || {};

    app.get('/new-password', newPasswordMiddleware('show', {
        'template' : {
            'failed' : options.failedView || 'new-password-fail'
        }
    }), options.action || newPassword);
}

var postNewPassword = function(req, res) {
    res.json({
        'error' : false
    });
};

export function saveNewPasswordRoute (app, options) {
    app.post('/new-password', newPasswordMiddleware('save', {
        'invalidRequest' : function(req, res, error) {
            res.status(422).json({
                'error' : true,
                'message' : 'Invalid password'
            });
        },

        'passwordsNotMatch' : function(req, res) {
            res.status(422).json({
                'error' : true,
                'message' : 'The passwords you entered do not match'
            });
        }
    }), options.action || postNewPassword);
}