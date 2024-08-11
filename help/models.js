const { Sequelize, DataTypes } = require('sequelize');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rights: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Define Ride model
const Ride = sequelize.define('Ride', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  driver: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  passenger: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timedate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

// Define UserRide model (for many-to-many relationship)
const UserRide = sequelize.define('UserRide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rideId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Set up associations
User.belongsToMany(Ride, { through: UserRide });
Ride.belongsToMany(User, { through: UserRide });

// Sync models with database
sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.error('Error creating database:', err));

module.exports = { User, Ride, UserRide };