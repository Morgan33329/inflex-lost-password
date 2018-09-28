var passwordRepository

import Promise from 'bluebird';
import { model } from './../../database';

class PasswordRepository {
    update (id, data) {
        let self = this;

        return new Promise((resolve) => {
            model('password')
                .updateOne({ 
                    '_id' : id 
                }, data, () => {
                    self.findOneById(id)
                        .then(password => {
                            resolve(password);
                        });
                });
        });
    }

    hasPassword (identity) {
        console.log({ 
            'identity_id' : identity
        });
        return new Promise((resolve) => {
            model('password')
                .find({ 
                    'identity_id' : identity
                })
                .exec((err, results) => {
                    resolve(results.length > 0);
                }); 
        });
    }

    findOneById (id) {
        return new Promise((resolve) => {
            model('password')
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
            });
    }

    findPassword (identity) {
        return new Promise((resolve) => {
            model('password')
                .findOne({ 
                    'identity_id' : identity
                })
                .exec((err, result) => {
                    resolve(result);
                });
        });
    }
}

export default function () {
    if (!passwordRepository)
        passwordRepository = new PasswordRepository();

    return passwordRepository;
}