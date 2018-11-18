require('./config/config')

const express = require('express')
const app = express()

//const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json())

app.use(require('./routes/usuario'));

const mongoose = require('mongoose');

mongoose.connect(process.env.URIDB, { useNewUrlParser: true }, (err, res) => {
    console.log('Inicio connect ...');
    if (err) throw err;
    console.log('Base de datos mongo ONLINE...');
});

app.listen(process.env.PORT, () => {
    console.log('Ejecutando en puerto', process.env.PORT);
})