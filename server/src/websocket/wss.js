const { WebSocketServer } = require('ws');
const connection = require('./connection');

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', connection);

module.exports = wss;