'use strict';

const dir = ["true", "1", 1, true].indexOf(process.env.DEVELOPER) != -1 ? 'src' : 'lib'; 

const lostPassword = require('./' + dir + '/lost-password');

exports.lostPasswordRoutes = lostPassword.lostPasswordRoutes;