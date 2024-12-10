const jwtConfig = {
  access: {
    expiresIn: `${1000 * 5}`, // 5 секунд
  },
  refresh: {
    expiresIn: `${1000 * 60 * 60 * 12}`, // 12 часов
  },
};

module.exports = jwtConfig;
