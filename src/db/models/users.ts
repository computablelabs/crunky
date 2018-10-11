// Dependencies
import { default as DataTypes, Sequelize} from 'sequelize'

// Local Dependencies
import { SequelizeAttributes,
  UserAttributes,
  UserInstance,
} from '../../interfaces'

const user = (sequelize: Sequelize) => {
  // define table columns
  const attributes: SequelizeAttributes<UserAttributes> = {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    publicAddress: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    nonce: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }

  // define table
  const table = sequelize.define<UserInstance, UserAttributes>(
    'users',
    attributes,
  )

  // define associations
  table.associate = (models) => {
    const { Sessions, Users } = models

    Users.hasMany(Sessions)
  }

  return table
}

export default user

