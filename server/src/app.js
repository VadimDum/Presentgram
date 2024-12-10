const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/usersRouter');
const messagesRouter = require('./routes/messagesRouter');
const groupsRouter = require('./routes/groupsRouter');
const authRouter = require('./routes/authRouter');
const tokensRouter = require('./routes/tokensRouter');
const wallelementRouter = require('./routes/wallelementRouter');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/wallelements', wallelementRouter);

module.exports = app;
