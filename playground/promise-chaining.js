require('../src/db/mongoose');
const User = require('../src/db/models/user');

// User.findByIdAndUpdate('5cdcf6355be49446a8fc1569', { age : 55 }).then((result) => {
//     console.log(result);
//     return User.countDocuments({ age: 55 });
// }).then((result) => {
//     console.log(result);    
// }).catch((error) => {
//     console.log(error);
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
};

updateAgeAndCount('5cdc64e7ae27e217ac8d68ed', 26).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log('error', error);
})