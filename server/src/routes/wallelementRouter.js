const { Router } = require('express');
const { User, Group, Message, UserGroup, Reaction, Wallelement, Wallauthor } = require('../../db/models');
const upload = require('../middlewares/upload');
const wallelementRouter = Router();

wallelementRouter
  .route('/')
  .get(async (req, res) => {
  try {
    const posts = await Wallelement.findAll({
      order: [['id', 'DESC']],
      include: [
        { model: User, as: 'Userwallprofile' },
        { model: User, as: 'Userwallauthor' },
      ],
    });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ text: 'Ошибка получения сообщений', message: error.message });
  }
})
  .post(async (req, res) => {
  try {
    const { userid, authorid, wallreaction } = req.body;
    const newPost = await Wallelement.create({
      userid: userid, 
      wallreaction: wallreaction,
      wallreactionimg: null, 
      authorid: authorid});
    res.json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ text: 'Ошибка получения сообщений', message: error.message });
  }
});

wallelementRouter
  .route('/:id')
  .get(async (req, res) => {
  try {
    const {id} = req.params;
    const posts = await Wallelement.findAll({
      where: { userid: id },
      order: [['id', 'DESC']],
      include: [{ model: User, as: 'Userwallauthor' }],
    });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ text: 'Ошибка получения сообщений', message: error.message });
  }
})
  .delete(async (req, res) => {
  try {
    const {id} = req.params;
    const posts = await Wallelement.destroy({
      where: { id: id },
    });
    res.json(posts);
  } catch (error) {
    console.log(error)
  }
});

wallelementRouter
  .route('/:userid/:authorid/images')
  .post(upload.single('img'), async (req, res) => {
    try {
      if (req.file) {
        const newFilename = req.file ? req.file.filename : oldUser.avatar;
        // await removeImage(oldUser.avatar); // раскомментируй, чтобы картинки удалялись
        const newPost = await Wallelement.create({
          userid: req.params.userid,
          wallreaction: '',
          wallreactionimg: newFilename,
          authorid: req.params.authorid,
        });
        res.status(200).json(newPost);
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ text: 'Ошибка добавления изображения', message: error.message });
    }
  });


module.exports = wallelementRouter;
