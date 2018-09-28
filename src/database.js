import database from 'inflex-authentication/database';

import mongoRepositories from "./database/mongo";

export function getType (type) {
    return database.getType();
}

export function getId (type) {
    return database.getId(type);
}

export function repository (type) {
    switch (getType()) {
        case 'mongo':
            return mongoRepositories(type);
            break;
    }
}

export function model (model) {
    return database.model(model);
}