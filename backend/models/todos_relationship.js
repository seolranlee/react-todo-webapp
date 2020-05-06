module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "todos_relationship",
    {
      todo_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      timestamps: false
    }
  );
};
