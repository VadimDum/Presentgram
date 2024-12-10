const express = require('express');
const bcrypt = require('bcrypt');
const authRouter = express.Router();
const { User } = require('../../db/models');
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../configs/cookieConfig');

authRouter.post('/signup', async (req, res) => {
  const { email, name, nick, password } = req.body;
  const hashpass = await bcrypt.hash(password, 10);
  const [newUser, created] = await User.findOrCreate({
    where: { email },
    defaults: { name, hashpass, nick },
  });
  if (!created) {
    return res.status(400).json({ text: 'Почта уже существует' });
  }

  const user = newUser.get();
  delete user.hashpass;
  const { refreshToken, accessToken } = generateTokens({ user });
  return res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieConfig)
    .json({ user, accessToken });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const targetUser = await User.findOne({ where: { email } });
  if (!targetUser) {
    return res.status(400).json({ text: 'Что-то пошло не так' });
  }

  const isValid = await bcrypt.compare(password, targetUser.hashpass);
  if (!isValid) {
    return res.status(400).json({ text: 'Что-то пошло не так' });
  }

  const user = targetUser.get();
  delete user.hashpass;
  const { refreshToken, accessToken } = generateTokens({ user });
  return res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieConfig)
    .json({ user, accessToken });
});

authRouter.post('/logout', async (req, res) =>
  res.clearCookie('refreshToken').status(200).send('Вы успешно вышли'),
);

module.exports = authRouter;