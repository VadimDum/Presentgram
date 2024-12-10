const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

function validateCookie(req, next) {
  cookieParser()(req, {}, () => {
    try {
      const { refreshToken } = req.cookies;
      const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      next(null, user);
    } catch (error) {
      console.log('Invalid cookie validation');
      next(error);
    }
  });
}
module.exports = validateCookie;
