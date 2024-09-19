const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Lets get started!'));

app.listen(80, () => console.log('Server ready'));

