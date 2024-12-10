const { Router } = require('express');
const { User, Group, Message, UserGroup, Reaction } = require('../../db/models');
const upload = require('../middlewares/upload');
const { ClientRequest } = require('http');

const usersRouter = Router();

usersRouter
    .route('/')
    .get(async (req, res) => {
    try {
      const users = await User.findAll({
        order: [['id', 'DESC']],
        include: [{ model: Reaction }],
      });
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ text: 'Ошибка получения сообщений', message: error.message });
    }
  });

usersRouter
  .route('/:userid/images')
  .patch(upload.single('img'), 
  async (req, res) => {
    try {
      console.log(req.file);
      const oldUser = await User.findByPk(req.params.userid);
      if (req.file) {
          const newFilename = req.file ? req.file.filename : oldUser.avatar;
          // await removeImage(oldUser.avatar); // раскомментируй, чтобы картинки удалялись
          await oldUser.update({ avatar: newFilename });
        }
      res.status(200).json(oldUser);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка редактирования изображения', message: error.message });
    }
  });


module.exports = usersRouter;
