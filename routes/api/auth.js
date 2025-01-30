const Router = require('express').Router();
const passport = require('passport');

const { authWanted, authUnwanted } = require('../../middleware/checkAuth.js');
const { apps } = require('../../models/users/app.js');

Router.get('/redirect', passport.authenticate('discord'));

Router.get('/callback', (req, res, next) => {
  passport.authenticate('discord', (err, user, info) => {
    if (err || !user) return res.redirect('/login');

    req.logIn(user, (err) => {
      if (err) return res.redirect('/login');

      req.session.user = user;
      req.session.app = null;
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});
Router.post('/app', async (req, res) => {
  const { session } = req;
  const { token } = req.body;

  try {
    const app = await apps.findOne({ token: token });
    if (!app) return res.json({ success: false, message: 'Invalid app!' });

    session.app = app;
    return res.json({ success: true, result: app });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
});

module.exports = Router;
