const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id: userOneId,
    email: 'test@tst.com',
    password: '123abc',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
    }, {
    _id: userTwoId,
    email: 'second@test.com',
    password: 'user2pass'
}];


const todos1 = [{
    _id: new ObjectId(),
    text: "First test todo"
},{
    _id: new ObjectId(),
    text: "First test todo"
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
      return  Todo.insertMany(todos1);
    }).then(() => done());
};


const populteUsers = (done) => {
    User.remove({}).then(() => {

        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);

    }).then(() => done());
}



module.exports = {todos1, populateTodos, users, populteUsers};