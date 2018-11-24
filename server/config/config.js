var env = process.env.NODE_ENV || 'developent';

//TODO da se pregleda tutorialot kako se setira env to avtomatski
//env = "test";
env = "development";

if(env === 'development' || env === 'test'){
    var config = require('./config.json');
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}