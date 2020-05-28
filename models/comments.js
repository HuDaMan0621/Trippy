'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    content_id: DataTypes.INTEGER,
    body: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  Comments.associate = function(models) {
    Comments.belongsTo(models.User) 
    Comments.belongsTo(models.Contents)
  };
  return Comments;
};