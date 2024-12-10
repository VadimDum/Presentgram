const jwtConfig = require('./jwtConfig');

const cookieConfig = {
  httpOnly: true,
  maxAge: jwtConfig.refresh.expiresIn,
  // secure: true,
  // sameSite: 'strict',
};

module.exports = cookieConfig;
