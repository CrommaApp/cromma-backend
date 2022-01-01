const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Keyword extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        modelName: 'Keyword',
        tableName: 'keywords',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Keyword.belongsTo(db.User);
  }
};
