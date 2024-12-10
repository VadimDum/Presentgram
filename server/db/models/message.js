'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Group, Reaction }) {
      this.belongsTo(User, { foreignKey: 'authorid' });
      this.belongsTo(Group, { foreignKey: 'groupid' });
      this.hasMany(Reaction, { foreignKey: 'messageid' });
    }
  }
  Message.init(
    {
      text: DataTypes.TEXT,
      authorid: DataTypes.INTEGER,
      groupid: DataTypes.INTEGER,
      authorName: DataTypes.STRING,
      isEdited: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Message',
    },
  );
  return Message;
};
