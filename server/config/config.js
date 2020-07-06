/**
 * PORT
 */
process.env.PORT = process.env.PORT || 8080;

/**
 * Environment
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Data base
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffeeShop'
} else {
    urlDB = 'mongodb+srv://Jonas:XCuorMMGV0xudRRC@cluster0.lwdq7.mongodb.net/coffeeShop';
}

process.env.URLDB = urlDB;