const Router = require('express').Router();

const { authWanted, authUnwanted } = require('../middleware/checkAuth.js');

const { apps } = require('../models/users/app.js');

Router.get('/', (req, res) => {
  if (!req.isAuthenticated()) res.redirect('/login');
  else res.redirect('/dashboard');
});

Router.get('/dashboard', authWanted, async (req, res) => {
  /*const userApps = [{
        id: '501401419367055360',
        name: 'TuberCord',
        description: 'None',
        avatar: 'fe16630dd31bf176d0902b6e2d9e5723'
    }]*/
  let userApps = [];
  const allApps = req.user.apps;

  console.log(allApps);
  for (const id of allApps) {
    const app = await apps.findOne({ id: id });
    if (app) userApps.push(app);
  }

  res.render('dashboard', {
    userApps: userApps,
  });
});
Router.get('/channels/@me', authWanted, (req, res) => {
  if (!req.session.app) return res.redirect('/dashboard');

  res.render('discord', {
    assignedApp: req.session.app,
  });
});

Router.get('/login', authUnwanted, (req, res) => {
  res.render('login');
});

module.exports = Router;
