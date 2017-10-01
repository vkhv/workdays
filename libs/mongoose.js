const mongoose = require('mongoose');

// TODO: вынести в конфиг
mongoose.connect('mongodb://192.168.0.101/test1');
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('connection error:', err.message);
});
db.once('open', () => {
  console.info('Connected to DB!');
});

const Schema = mongoose.Schema;

const Employee = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  tel: { type: String, required: true },
  note: { type: String, required: true },
});

const EmployeeModel = mongoose.model('Employee', Employee);
module.exports.EmployeeModel = EmployeeModel;
