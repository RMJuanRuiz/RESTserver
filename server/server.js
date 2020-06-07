const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.json('Hello World')
})

app.listen(8080, () => {
    console.log('listening 8080 port');
})