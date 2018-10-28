const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos1 = [{
    _id: new ObjectId(),
    text: "First test todo"
},{
    _id: new ObjectId(),
    text: "First test todo"
}];


beforeEach((done) => {
    Todo.remove({}).then(() => {
      return  Todo.insertMany(todos1);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                   return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
    
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
    
    
            });
    
    });


    describe('Get /todos', () => {

        it('should get all todos', (done) => {

            request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);


        });



    });

    

});

describe('GET /todos/:id', () => {

    it('Should return todo doc', (done) => {

        request(app)
            .get(`/todos/${todos1[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos1[0].text);
            })
            .end(done);

    });

    it('Should return 404 if todo not found', (done) => {

        request(app)
        .get(`/todos/${ObjectId("507f1f77bcf86cd799439011")}`)
        .expect(404)
        .end(done);
        

    });

    it('Should return 404 if for non ojct ids', (done) => {

        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);

    });


});




