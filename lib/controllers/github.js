
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const { exCodeForToken, getGithubProfile, } = require('../services/github');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    // console.log('route');
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const token = await exCodeForToken(code);
      const githubProfile = await getGithubProfile(token);
      console.log('sup', githubProfile);
      let user = await GithubUser.findByUsername(githubProfile.login);
      if (!user) {
        user = await GithubUser.insert({
          username: githubProfile.login,
          email: githubProfile.email,
          avatar: githubProfile.avatar_url,
        });
        console.log(user, 'boy');
      }
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      console.log('potato', payload);
      res.cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      }).redirect('/api/v1/github/dashboard');
    } catch (e) {
      next(e);
    }
  })
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  });
