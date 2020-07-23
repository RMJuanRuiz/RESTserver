require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable public folder
app.use(express.static(path.resolve(__dirname, '../public')));

// Routes global configuration
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err, resp) => {
    if (err) throw err;
    console.log('DB Online');
});


app.listen(process.env.PORT, () => {
    console.log(`listening port ${ process.env.PORT }`);
})