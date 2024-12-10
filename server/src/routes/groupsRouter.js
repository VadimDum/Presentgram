const { Router } = require('express');
const { User, Group, Message, UserGroup, Reaction } = require('../../db/models');
const groupsRouter = Router();

groupsRouter.route('/').get(async (req, res) => {
  try {
    const groups = await Group.findAll({
      order: [['id', 'DESC']],
      include: [
        {
          model: User,
          as: 'Owner', 
          attributes: ['id', 'name', 'email', 'nick'], 
        },
        {
          model: User,
          as: 'GroupUser', 
          through: { attributes: [] }, 
          attributes: ['id', 'name', 'email', 'nick'],
        },
      ],
    });
    res.json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json({ text: 'Ошибка получения групп', message: error.message });
  }
});

groupsRouter.route('/:groupId/users').get(async (req, res) => {
  try {
    const { groupId } = req.params;

    
    const usersInGroup = await UserGroup.findAll({
      where: { groupId }, 
      include: [
        {
          model: User, 
        },
      ],
    });

    if (usersInGroup.length === 0) {
      return res.status(404).json({ message: 'Пользователи не найдены для указанной группы' });
    }

    res.json(usersInGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения пользователей группы', error: error.message });
  }
});






module.exports = groupsRouter;
