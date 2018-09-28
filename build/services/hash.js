import Promise from 'bluebird';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import { authConfig } from 'inflex-authentication';

import { repository } from './../database';

function createHash(identity) {
    return crypto.createHash('md5').update(identity + '_' + new Date().getTime()).digest('hex');
}

export function generateHash(email) {
    return repository('account').findOneByAccount(email).then(account => {
        if (!account) return Promise.reject('Account not found');

        var hash = createHash(account.identity_id);

        return repository('hash').insert({
            'identity_id': account.identity_id,
            'account_id': account.id,
            'hash': hash,
            'type': 1
        }).then(savedHash => {
            console.log('New password hash generated');

            return hash;
        }).catch(err => {
            console.log(err);
        });
    });
}

export function send(res, to, hash, options) {
    res.render(options.view, {
        url: authConfig('host') + options.url + '?code=' + hash
    }, (err, template) => {
        if (err) return Promise.reject(err);

        nodemailer.createTransport(authConfig('mailTransport')).sendMail({
            from: options.from,
            subject: options.subject,
            html: template,
            to: to
        }, (error, info) => {
            if (!error) console.log('Lost password mail sent');else console.log('Email send error');
        });
    });
}

export function deleteHash(hash) {
    repository('hash').deleteByHash(hash).then(() => {
        console.log('Hash deleted');
    });
}

export function check(code) {
    repository('hash').findHash(code).then(hash => {
        if (!hash) {
            res.render(settings.template.failed, {
                message: settings.invalidCodeMessage
            });
        } else {
            req.identity = hash.identity_id;

            next();
        }
    }).catch(err => {
        console.log(err);
    });
}