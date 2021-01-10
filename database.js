const {Sequelize, DataTypes, Model, Op} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        operatorsAliases: null,

        pool: {
            max: parseInt(process.env.DB_CONNECTION_LIMIT),
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

const Posts = sequelize.define('posts', {
    postId: {type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true, autoIncrement: true},
    fullName: {type: DataTypes.STRING, allowNull: false, unique: false},
    captionText: {type: DataTypes.STRING, allowNull: true, defaultValue: null},
    imageUrl: {type: DataTypes.STRING, allowNull: true},
})

Posts.sync({alter: true})

// const dummyPost = Posts.create({fullName: 'Reyna Merhabi', captionText: 'hey', imageUrl: 'url.com'});

sequelize.authenticate().then(() => {
    console.log('connected successfully');
}).catch(err => console.log(err))

module.exports = {
    Posts: Posts
}