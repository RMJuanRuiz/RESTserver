require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(require('./routes/user'));

mongoose.connect('mongodb://localhost:27017/coffeeShop', {
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