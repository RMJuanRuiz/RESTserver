/**
 * PORT
 */
process.env.PORT = process.env.PORT || 8080;

/**
 * Environment
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Token expiration
 * 60 sec
 * 60 min
 * 24 hours
 * 60 days
 */
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

/**
 * Authentication seed
 */
process.env.SEED = process.env.SEED || 'development-seed';

/**
 * Data base
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffeeShop'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/**
 * Google sign in client id
 */
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '959963359112-jn9ea4f9vidgpedu794odunt0q8eqagm.apps.googleusercontent.com';