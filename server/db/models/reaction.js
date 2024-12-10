'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Message}) {
      this.belongsTo(User, {foreignKey: 'authorid'});
      this.belongsTo(Message, {foreignKey: 'messageid'});
    }
  }
  Reaction.init({
    reaction: DataTypes.STRING,
    authorid: DataTypes.INTEGER,
    messageid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reaction',
  });
  return Reaction;
};