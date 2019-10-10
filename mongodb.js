// CRUD Create Read Update Delete
const mongodb = require('mongodb');
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName);

    // db.collection('users').findOne({ _id: new ObjectID('5cdc072fab9321192066c64f') }, (error, response) => {
    //     if (error) {
    //         return console.log('Error');
    //     }
    //     console.log(response);
    // })

    // db.collection('users').find({ age: 31 }).toArray((error, response) => {
    //     console.log(response);
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID('5cdc0521ae637e4ae4f10170')}, (error, response) => {
    //     if (error) {
    //         return console.log('Error');
    //     }
    //     console.log(response);
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, response) => {
    //     if (error) {
    //         return console.log('Error');
    //     }
    //     console.log(response);
    // })
    
    // db.collection('users').updateOne({
    //     _id: ObjectID('5cdba0832150cf249027af6c')
    // }, {
    //     $inc: {
    //         age: 5
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })
    
    db.collection('tasks').deleteMany({  // I think this shouldn't be here.
        completed: true
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
});

