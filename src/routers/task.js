const express = require('express');
const taskRouter = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

taskRouter.post('/tasks', auth, async (req, res) => { // Create task
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e)
    }
});
// GET /tasks/sortBy=createdAt_asc

taskRouter.get('/tasks', auth, async (req, res) => { // Get all tasks
    const match = {};
    const sort = {};

    if (req.query.completed === 'true' || req.query.completed === 'false') {
        match.completed = req.query.completed === 'true' ? true : false
    }
    req.query.completed; // Remove

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_');
        if (parts[1] === 'asc') {
            sort.createdAt = 1
        } else if (parts[1] === 'desc') {
            sort.createdAt = -1
        }
    }
    
    try {
        await req.user.populate({
            path: 'tasks',
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

taskRouter.get('/tasks/:id', auth, async (req, res) => { // Get single task. 
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
});

taskRouter.patch('/tasks/:id', auth, async (req, res) => {
    const input = Object.keys(req.body);
    const allowedInputs = ['task', 'completed'];
    const isValid = input.every((elem) => allowedInputs.includes(elem));
    if (!isValid) {
        return res.status(400).send({ error: "Not a valid input"});
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        
        if (!task) {
            return res.status(404).send();
        }
        input.forEach((elem) => task[elem] = req.body[elem]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.send(404).send();
        }
        res.send({ message : 'task deleted', task })
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = taskRouter;