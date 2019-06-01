const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// create a schema
const setsSchema = new Schema({
    date: String,
    exId: Number,
    reps: Number,
    weight: Number
}, {collection: "setsList"});
// we need to create a model using it
const UserSet = mongoose.model('UserSet', setsSchema);
module.exports = UserSet;

// Example final result
// id: 'sdkjfnsjkl439irwenjfi',
// date: '12345',
// exercise: {id: 1, name: 'Flat Bench press', type: 'Compound', targets: 'csa'},
// reps: 10,
// weight: 60