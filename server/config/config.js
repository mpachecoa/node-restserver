process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if (process.env.NODE_ENV == 'dev') {
    // DB
    process.env.URIDB = 'mongodb://localhost:27017/cafe';
    // Port
    process.env.PORT = 3000;

} else {
    process.env.URIDB = process.env.NODE_DB
}