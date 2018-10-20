//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect(  'mongodb://localhost:27017/TodoApp', 
                        { useNewUrlParser: true },
                        (err, client) => {
    if(err){
        return console.log('Unable to connect to the MongoDb server');
    }
    console.log('Connected to MongoDb');

    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //         _id: new ObjectId('5bcb89f9b7b3430e1dcb4830')
    //     }, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false
    //     }

    // ).then((result) => {
    //     console.log(result);
    // });


    db.collection('Users').findOneAndUpdate({
        _id: new ObjectId('5bc797789ba5cf1886b12da3')
    },{
        $set: {
            name: 'Sinisha'
        },
        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }
    ).then((result) => {
        console.log(result);
    });
    

    //client.close();

    


});
