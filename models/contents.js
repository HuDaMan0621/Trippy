'use strict';
module.exports = (sequelize, DataTypes) => {
  const Contents = sequelize.define('Contents', {
    user_id: DataTypes.STRING,
    body: DataTypes.STRING(50000),
    img_path: DataTypes.STRING,
    lat_location: DataTypes.INTEGER,
    long_location: DataTypes.INTEGER,
    location: DataTypes.STRING,
    date: DataTypes.DATE,
    title: DataTypes.STRING,
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
    fts: DataTypes.STRING,
  }, {});
  Contents.associate = function (models) {
    Contents.belongsTo(models.User)
    Contents.hasMany(models.Comments)
  };
  return Contents;
};