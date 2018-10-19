'use strict';

import _ from 'lodash';
import { check, validationResult } from 'express-validator/check';
import { authConfig } from 'inflex-authentication';
import { defineSettings, settingsByUrl } from 'inflex-authentication/helpers';

import { repository } from './../database';
import { change as changePassword } from './../services/password';
import { deleteHash } from './../services/hash';

const defaultSettings = {
    'codeField' : 'code',
    'passwordField' : 'password',
    'confirmField' : 'password_confirm',
    
    'invalidCodeMessage' : 'This link is invalid',

    'invalidRequest' : null,
    'passwordsNotMatch' : null,

    'template' : {
        'failed' : 'lost-password-fail'
    }
};
var versionSettings = {};

var getCode = function (req) {
    return req.query[settings['codeField']] || req.body[settings['codeField']];
}

var checkCode = function (req, res, next) {
    let code = getCode(req);

    repository('hash')
        .findHash(code)
        .then(hash => {
            if (!hash) {
                let settings = settingsByUrl(req, versionSettings);

                res.render(settings.template.failed, {
                    message : settings.invalidCodeMessage
                });
            } else {
                req.identity = hash.identity_id;

                next();
            }
        })
        .catch(err => {
            console.log(err);
        });
}

// Show new password input

export function show (options, middleware) {
    settings = _.merge(defaultSettings, options || {});

    let settings = settingsByUrl(req, versionSettings);

    if (settings.template.failed === '') {
        console.log('ERROR: You need define error message template for new password');
        process.exit(1);
    }

    var ret = middleware || [];

    ret.push(
        checkCode
    );  

    return ret;
}

// Save password

var validateInput = function (req, res, next) {
    let validateInputs = authConfig('validateInputs'),
        settings = settingsByUrl(req, versionSettings);

    return validateInputs.password(check(settings.passwordField))(req, res, next);
}

var validateRequest = function (req, res, next) {
    var errors = validationResult(req);
            
    if (!errors.isEmpty()) {
        console.log('Invalid new password form request', errors.array());

        settings.invalidRequest(req, res, errors.array(), settings);
    } else
        next();
}

var checkEqualPassword = function (req, res, next) {
    let password = req.body[settings['passwordField']],
        confirm = req.body[settings['confirmField']];

    if (password && password === confirm) {
        next();
    } else {
        let settings = settingsByUrl(req, versionSettings);

        settings.passwordsNotMatch(req, res);
    }
}

var savePassword = function (req, res, next) {
    let password = req.body[settings['passwordField']],
        
        identity = req.identity;

    delete req.identity;

    changePassword(identity, password)
        .then(() => {
            let code = getCode(req);

            deleteHash(code);
        })
        .catch((err) => {
            console.log(err);
        });

    next();
}

export function save (options, middleware) {
    let version = options && options.version || 'default';

    middleware = middleware || [];
    versionSettings = defineSettings(version, options, versionSettings, defaultSettings);

    let settings = settingsByUrl(req, versionSettings);

    if (settings.invalidRequest === null) {
        console.log('ERROR: You need define invalidRequest function for new password');
        process.exit(1);
    } else if (settings.passwordsNotMatch === null) {
        console.log('ERROR: You need define passwordsNotMatch function for new password');
        process.exit(1);
    }

    var ret = middleware;

    ret.push(
        checkCode,

        validateInput,
        validateRequest,

        checkEqualPassword,

        savePassword
    );  

    return ret;
}