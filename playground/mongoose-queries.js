const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5bcceb7c5738c22fc2c43f21s';

// if(!ObjectId.isValid(id)){
//     console.log( 'Id not valid' );
// }


// Todo.find({
//     _id : id
// }).then((todos) => {
//     console.log(  'Todos', todos  );
// });

// Todo.findOne({
//     _id : id
// }).then((todo) => {
//     console.log(  'Todo', todo  );
// });

// Todo.findById(id).then((todo) => {

//     if(!todo){
//         return console.log('Id not found');
//     }

//     console.log('Todo', todo);
// }).catch((e) => console.log(e));



User.findById('5bcba3d3df633f28711b057e').then((user) => {
    if(!user){
        return console.log('no users with that id');
    }
    console.log( 'User', user);
}).catch((e) => {
    console.log(e);
});



