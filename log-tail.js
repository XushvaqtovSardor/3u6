// const winston = require('winston');
// // Requiring `winston-mongodb` will expose winston.transports.MongoDB`
// require('winston-mongodb');

// import winston from 'winston-mongodb'
// const log = winston.createLogger({
//   level: 'info',
//   transports: [
//     // write errors to console too
//     new winston.transports.Console({format: winston.format.simple(), level:'error'})
//   ],
// });

// // logging to console so far
// log.info('Connecting to database...');

// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb://localhost:27017/mydb";

// const client = new MongoClient(url);
// await client.connect();

// const transportOptions = {
//   db: await Promise.resolve(client),
//   collection: 'log'
// };

// log.add(new winston.transports.MongoDB(transportOptions));

// log.info('Connected to database.',{url});
