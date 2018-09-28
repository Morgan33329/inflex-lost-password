import Promise from 'bluebird';
import bcrypt from 'bcrypt';

import { repository, getId } from './../database';

export function change(identity, password) {
    var self = this;
    //Egyenlőre egyszerre csak egy jelszót kezel
    return repository('password').findPassword(identity).then(pwd => {
        if (!pwd) return Promise.reject("Password not found");

        var saltRounds = 10;

        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) Bluebird.reject(err);

                repository('password').update(getId(pwd), {
                    password: hash
                }).then(pwd => {
                    console.log("Password updated");

                    resolve();
                });
            });
        });
    });
}