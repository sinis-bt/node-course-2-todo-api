const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos1, populateTodos, users, populteUsers} = require('./seed/seed');
var {User} = require('./../models/user');



beforeEach(populteUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
        });
    });
});

describe('GET /todos/:id', () => {

    it('Should return todo doc', (done) => {

        request(app)
            .get(`/todos/${todos1[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos1[0].text);
            })
            .end(done);

    });

    it('Should return 404 if todo not found', (done) => {

        request(app)
        .get(`/todos/${ObjectId("507f1f77bcf86cd799439011")}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
        

    });

    it('Should return 404 if for non ojct ids', (done) => {

        request(app)
        .get(`/todos/123`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);

    });


});


describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {
        var hexId = todos1[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);

            }).
            end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not remove a todo', (done) => {
        var hexId = todos1[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)            
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectId().toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);

    });

    it('should return 404 if oject id is invalid', (done) => {
        request(app)
        .delete(`/todos/123abc`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });


});

describe('GET /users/me', () => {
    it('should return user if authentucated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token )
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authentucated', (done) => {
        
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);

    })
});


describe('POST /users', () =>{

    it('should create a user', (done) => {

        var email = 'example@example.com';
        var password = '123mnb!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end(done);

    });

    it('should return validaion error if request invalid', (done) => {

        var email = 'example@examxple,com';
        var password = '1';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)            
            .end(done);


    });

    it('should not create email if user in use', (done) => {

        var email = 'test@tst.com';
        var password = '1dsdsdsdsd';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)            
            .end(done);

    });

});

describe('POST /users/login', () => {
    
    it('should login user and return auth token', (done) => {

        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password + 's'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done(e));
        });  
              
    });
});


describe( 'DELETE /users/me/tokens', () => {

    it('should remove auth token on logouut', (done) => {

        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {

                if(err){
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });


});

