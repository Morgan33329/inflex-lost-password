var accountRepository;

import Promise from 'bluebird';
import { model } from './../../database';

class AccountRepository {
    findOneByAccount (account) {
        return new Promise((resolve) => {
            model('account')
                .findOne({ 
                    'account' : account
                })
                .exec((err, results) => {
                    resolve(results);
                });
        });
    }
}

export default function () {
    if (!accountRepository)
        accountRepository = new AccountRepository();

    return accountRepository;
}