const validateCookie = require('../middlewares/validateCookie');
const wss = require('./wss');

function upgrade(request, socket, head) {
  socket.on('error', console.error);

  // This function is not defined on purpose. Implement it with your own logic.
  validateCookie(request, (err, user) => {
    if (err || !user) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // socket.removeListener('error', onSocketError);

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, user);
    });
  });
}

module.exports = upgrade;