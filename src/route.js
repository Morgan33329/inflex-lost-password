import { lostPasswordMiddleware } from './lost-password';
import { newPasswordMiddleware } from './new-password';

import { authConfig } from 'inflex-authentication';

// Send lost password
var sendSuccess = function (req, res) {
    res.json({
        'error' : false
    });
}

export function sendLostPasswordRoute (app, options, version) {
    options = options || {};

    let defaultFrom = authConfig('mailTransport.auth.user'),
        
        fromMail = options.from && options.from.email 
            ? options.from.email
            : defaultFrom,
        fromName = options.from && options.from.name
            ? options.from.name
            : fromMail;

    app.post(
        (version ? '/' + version : '') + '/api/lost-password', 
        lostPasswordMiddleware({
            'version' : version,
            'email' : {
                'from' : {
                    'email' : fromMail,
                    'name' : fromName
                },
                'subject' : options.subject || 'Lost password'
            }
        }), 
        options.action || sendSuccess
    );
}

// Show new password form
var newPassword = function (req, res) {
    res.render('new-password', {
        code : req.query['code'] || '0'
    });
}

export function showNewPasswordRoute (app, options) {
    options = options || {};

    app.get(
        '/new-password', 
        newPasswordMiddleware('show', {
            'invalidCodeMessage' : options.invalidCode || 'This link is invalid'
        }), 
        options.action || newPassword
    );
}

// Save new password
var postNewPassword = function(req, res) {
    res.json({
        'error' : false
    });
};

export function saveNewPasswordRoute (app, options) {
    app.post(
        '/new-password', 
        newPasswordMiddleware('save', {
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
        }), options.action || postNewPassword
    );
}