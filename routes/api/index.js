const Router = require('express').Router();

const { apps } = require('../../models/users/app.js');

Router.use('/auth', require('./auth.js'));

Router.post('/app/remove', async (req, res) => {
  const { user } = req;
  const { id } = req.body;

  try {
    const exists = await apps.findOne({ id: id });
    if (!exists) return res.json({ success: false, message: 'not found' });

    await apps.findOneAndDelete({ id: id });
    user.apps.pull(id);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }

  // OTcwMTY0MDQzMjcwNzM3OTUx.GzyayA.GJbkv779M5REQwrx-5hIH3Rn22-kAkEDHj8Ias
});
Router.post('/app/add', async (req, res) => {
  const { user } = req;
  const { token } = req.body;

  if (!token) return res.json({ success: false, message: 'no token' });
  try {
    const bot = await fetch(`https://discord.com/api/v10/applications/@me`, {
      method: 'GET',
      headers: { Authorization: `Bot ${token}` },
    });
    const results = await bot.json();

    if (!bot.ok) {
      return res
        .status(bot.status)
        .json({ success: false, message: results.message });
    }

    const appExists = await apps.findOne({ id: results.bot.id });
    if (appExists) return res.json({ success: false, message: 'exists' });

    const newApp = await new apps({
      token: token,
      id: results.bot.id,
      username: results.bot.username,
      description: results.description || 'N/A',
      avatar: results.bot.avatar,
    }).save();

    user.apps.push(results.bot.id);
    await user.save();

    res.json({ success: true, data: results });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
});

Router.get('/channel/:id/messages', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${id}/messages`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bot OTcwMTY0MDQzMjcwNzM3OTUx.GzyayA.GJbkv779M5REQwrx-5hIH3Rn22-kAkEDHj8Ias`,
        },
      }
    );

    const results = await response.json();

    res.json({ success: true, results });
  } catch (err) {
    console.log(err);
  }
});

module.exports = Router;
