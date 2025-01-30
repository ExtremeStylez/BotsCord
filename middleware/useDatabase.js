const mongo = require('mongoose');

mongo.connect(process.env.mongoUri);
return console.log('> Database Ready');
