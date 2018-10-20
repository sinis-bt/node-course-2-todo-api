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

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false

    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops,undefined, 2))

    // });


    db.collection('Users').insertOne({
        name: 'Sinisha',
        age: 25,
        location: 'Sweden'

    }, (err, result) => {
        if(err){
            return console.log('Unable to insert users', err);
        }

        //console.log(JSON.stringify(result.ops,undefined, 2))

        console.log(  result.ops[0]._id.getTimestamp() );

    });


    client.close();
});







