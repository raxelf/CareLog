const express = require('express');
const router = require('./routers/router');
const session = require('express-session');
const app = express();
const port = 3000

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'careLog EMR',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true,
    maxAge: 1 * 60 * 60 * 1000 // 1 hour cookies
  }
}));

app.use(router);

app.listen(port, () => {
  console.log(`CareLog app listening on port ${port}`)
})
