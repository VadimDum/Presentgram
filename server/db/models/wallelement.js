'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallelement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsTo(User, { foreignKey: 'userid', as: 'Userwallprofile' });
      this.belongsTo(User, { foreignKey: 'authorid', as: 'Userwallauthor' });

    }
  }
  Wallelement.init(
    {
      userid: DataTypes.INTEGER,
      authorid: DataTypes.INTEGER,
      wallreaction: DataTypes.STRING,
      wallreactionimg: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Wallelement',
    },
  );
  return Wallelement;
};