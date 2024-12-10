const { Router } = require('express');
const { User, Group, Message, UserGroup, Reaction } = require('../../db/models');
const messagesRouter = Router();

messagesRouter.route('/').get(async (req, res) => {
  try {
    const message = await Message.findAll({
      order: [['id', 'DESC']],
      include: [{ model: Reaction }, { model: User }, { model: Group }],
    });
    res.json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ text: 'Ошибка получения сообщений', message: error.message });
  }
});

module.exports = messagesRouter;
