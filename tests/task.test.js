const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {
    taskOneId,
    taskTwoId,
    taskThreeId,
    userOneId, 
    userOne, 
    userTwoId, 
    userTwo, 
    setupDatabase 
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            task: 'A new task', 
            completed: false
        })
        .expect(201)
        const task = await Task.findById(response.body._id)
        expect(task.task).toBe('A new task');
        expect(task.completed).toBe(false);
        expect(task.owner).toEqual(userOneId);
})

test('Only returns tasks that belong to correct user', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        expect(response.body.length).toEqual(2)
        response.body.forEach((elem) => {
            let control = true;
            if (userOneId === elem.owner) {
                control = false;
            }
            expect(control).toBe(true); 
        })
})

test('User should only be able to delete tasks that belong to them', async() => {
    const response = await request(app)
    .delete(`/tasks/${taskOneId}`) // Task belonging to user one
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`) // User two logs in
    .send()
    .expect(404)
    const task = await Task.findById(taskOneId);
    expect(task).not.toBeNull();
})