const express = require('express');

const app = express();

app.use(express.static('./dist/cgana'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/cgana/'}
  );
});

app.listen(process.env.PORT || 8080);