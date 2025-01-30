require('dotenv').config();

const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const { join } = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

require('./middleware/useDatabase.js');

app.use(express.static(join(__dirname + '/pages/assets/')));
app.set('views', join(__dirname + '/pages/'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

require('./middleware/discordStrat.js');

app.use(
  session({
    //store: mongoStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index.js'));
app.use('/api', require('./routes/api/index.js'));

server.listen(4655, () => {
  console.log('> Website Ready');
});
