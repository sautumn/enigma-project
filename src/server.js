const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const engima = require('./engima-helper');

const staticFiles = path.resolve(__dirname);

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true,
}));

app.use(express.static(staticFiles));

app.post('/encrypt', (req, res) => {
  const { urlHash, messageText, date } = req.body;
  const newDate = new Date(date);
  engima.encryptMessage(urlHash, messageText, newDate)
    .then((encrypted) => {
      res.send(encrypted);
    });
});

app.post('/decrypt', (req, res) => {
  const { urlHash, encryptedMessage } = req.body;
  engima.decryptMessage(urlHash, encryptedMessage)
    .then((decrypted) => {
      res.send(decrypted);
    })
    .catch(err => res.send(err));
});

app.listen(process.env.PORT || 3000, () => {
    // eslint-disable-next-line
    console.log('Local server listening at 3000');
});
