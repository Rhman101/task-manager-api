const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'User'
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    next();
})

const Task = mongoose.model('Task', userSchema);

module.exports = Task;