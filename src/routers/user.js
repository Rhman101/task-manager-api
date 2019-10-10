const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account');

router.post('/users', async (req, res) => { // Create a new user (logs in automatically)
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => { // Log in user. 
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((elem) => {
            return elem.token !== req.token;
        })
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/users', auth, async (req, res) => { // Sends a list of all users and data. 
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.patch('/users/me', auth, async (req, res) => { // Edit user details. 
    console.log(req.user);
    const items = Object.keys(req.body);
    const allowedItems = ['name', 'age', 'password', 'email'];
    const result = items.every((elem) => allowedItems.includes(elem));
    !result && res.status(404).send({ error: "Invalid input"});
    try {
        items.forEach((elem) => req.user[elem] = req.body[elem]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => { // Delete user by ID. 
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     res.status(404).send();
        // }
        await req.user.remove();
        res.send(req.user);
        console.log('req.user.name', req.user.name);
        console.log('req.user.email', req.user.email);
        sendGoodbyeEmail(req.user.email, req.user.name)
    } catch (e) {
        res.status(500).send(e); 
    }
})

const uploadProfilePic = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true);
    }
})

router.post('/users/me/avatar', auth, uploadProfilePic.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: 'Error!' })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
})

module.exports = router; 