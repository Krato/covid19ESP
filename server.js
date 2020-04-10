const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

let app = express();

// Use a fallback for non-root routes (required for Vue router)
//   NOTE: History fallback must be "used" before the static serving middleware!
app.use(history());

app.use(serveStatic(__dirname + "/dist"));

const port = process.env.PORT || 5000;
app.listen(port);