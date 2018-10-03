'use strict';

import _ from 'lodash';
import { check, validationResult } from 'express-validator/check';

import { repository, getId } from './../database';
import {
    generateHash,
    send
} from './../services/hash';

var defaultSettings = {
    'emailField' : 'email',

    'autoSend' : true,

    'newPasswordUrl' : '/new-password',

    'email' : {
        'from' : {
            'email' : 'lost-password@project.org',
            'name' : 'lost-password@project.org'
        },
        'view' : 'lost-password',
        'subject' : 'Lost password'
    },

    'invalidRequest' : function (req, res) {
        return res.status(422).json({ 
            'error' : true,
            "code" : '4220201',
            "type" : '',
            "title" : 'Invalid username or password',
            "detail" : 'Invalid username or password'
        });
    },

    'emailNotExists' : function (req, res) {
        return res.status(422).json({ 
            'error' : true,
            "code" : '4220202',
            "type" : '',
            "title" : 'Email not exists',
            "detail" : "Email not exisst in database"
        });
    },

    'noPassword' : null
}
var settings = defaultSettings;

var validateEmail = function (req, res, next) {
    return check(settings.emailField).isEmail()(req, res, next);
}

var isValidRequest = function (req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        console.log('Invalid lost password request', errors.array());

        settings.invalidRequest(req, res, errors.array(), settings);
    } else
        next();
}

var checkEmailExists = function (req, res, next) {
    let to = req.body[settings['emailField']];

    repository("account")
        .findOneByAccount(to)
        .then(account => { 
            if (!account) {
                console.log('Email: ' + req.body[settings['emailField']] + ' not exists');

                return settings.emailNotExists(req, res);
            }

            repository("password")
                .hasPassword(account.identity_id)
                .then(has => {
                    if (has) {
                        console.log("Email found");

                        next();
                    } else {
                        console.log("Email found, but no password");

                        if (settings.noPassword)
                            settings.noPassword(req, res);
                        else
                            settings.emailNotExists(req, res);
                    }
                });
        })
        .catch(err => {
            console.log(err);
        });
}

var sendEmail = function (req, res, next) {
    let to = req.body[settings['emailField']];

    generateHash(to)
        .then(hash => {
            if (settings.autoSend) {
                send(res, to, hash, {
                    'url' : settings.newPasswordUrl,

                    'from' : settings.email.from.email,
                    'subject' : settings.email.subject,
                    
                    'view' : settings.email.view
                });
            } else
                req.hash = hash;

            next();
        })
        .catch(err => {
            console.log(err);
        });
}

export default function (options, middleware) {
    settings = _.merge(defaultSettings, options || {});

    var ret = middleware || [];

    ret.push(
        validateEmail,
        isValidRequest,

        checkEmailExists,

        sendEmail
    );

    return ret;
}