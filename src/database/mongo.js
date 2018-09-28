import AccountRepository from './mongo/account';
import HashRepository from './mongo/hash';
import PasswordRepository from './mongo/password';

export default function (type) {
    switch (type) {
        case 'account':
            return AccountRepository();
        case 'hash':
            return HashRepository();
        case 'password':
            return PasswordRepository();
    }
}