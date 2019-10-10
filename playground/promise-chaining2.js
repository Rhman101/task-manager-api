require('../src/db/mongoose');
const User = require('../src/db/models/task');

// User.findByIdAndDelete({ _id: '5cdd5b5b9990da30d8fcea5b'}).then((response) => {
//     console.log(response);
//     return User.countDocuments({ completed: false });
// }).then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.log(error);
// })

const deleteTaskAndCount = async (id) => {
    const taskDelete = await User.findByIdAndDelete({ _id: id });
    const count = await User.countDocuments({ completed: false })
    return count;
};

deleteTaskAndCount('5cdd5cb39990da30d8fcea5d').then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error);
});