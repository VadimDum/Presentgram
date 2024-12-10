const app = require('./app');
const { createServer } = require('http');
const upgrade = require('./websocket/upgrade');
require('dotenv').config();


const PORT = process.env.PORT || 3000;

const server = createServer(app);

server.on('upgrade', upgrade);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


