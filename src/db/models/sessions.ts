// Dependencies
import { default as DataTypes, Sequelize} from 'sequelize'

// Local Dependencies
import {
  SequelizeAttributes,
  SessionAttributes,
  SessionInstance,
} from '../../interfaces'

const session = (sequelize: Sequelize) => {
  // define table columns
  const attributes: SequelizeAttributes<SessionAttributes> = {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    userId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    authToken: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  }

  // define table
  const table = sequelize.define<SessionInstance, SessionAttributes>(
    'sessions',
    attributes,
  )

  // define associations
  table.associate = (models) => {
    const { Sessions, Users } = models

    Sessions.belongsTo(Users)
  }

  return table
}

export default session

