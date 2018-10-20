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

    // deleteMany
    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result) => {
    //     console.log( result );
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {
    //     console.log( result );
    // });

    // FindOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //          console.log( result );
    //  });

    //client.close();

    // db.collection('Users').deleteMany({name:'Sinisha'}).then((result) => {
    //     console.log( result );
    // });


    db.collection('Users').findOneAndDelete({ _id: new ObjectId('5bc797dc23ae0818b11e677a')}).then((result) => {
                  console.log( result );
    });


});
