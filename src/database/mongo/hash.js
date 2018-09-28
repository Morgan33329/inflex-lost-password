var hashRepository;

import Promise from 'bluebird';
import nodemailer from 'nodemailer';

import { model } from './../../database';

class HashRepository {
    insert (data) {        
        return new Promise((resolve) => {
            model('hash')
                .create(data, (err, result) => {
                    resolve(result);
                });
        });
    }

    findHash (hash) {
        return new Promise((resolve) => {
            model('hash')
                .findOne({ 
                    'hash' : hash,
                    'type' : 1
                })
                .exec((err, result) => {
                    resolve(result);
                });
        });
    }

    deleteByHash (hash) {
        return new Promise((resolve) => {
            model('hash')
                .deleteOne({
                    'hash' : hash
                }, function (err) {
                    resolve()
                });
        });
    }
}

export default function () {
    if (!hashRepository)
        hashRepository = new HashRepository();

    return hashRepository;
}