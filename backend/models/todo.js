module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "todo",
    {
      todo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      text: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        allowNull: false
      }
    },
    {
      charset: "utfmb4",
      collate: "utf8mb4_general_ci"
    },
    {
      timestamps: false
    }
  );
};
