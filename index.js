// TODO: Добавить логгер
const express = require('express');

const app = express();
const router = express.Router();
const bodyPaser = require('body-parser');
const EmployeeModel = require('./libs/mongoose').EmployeeModel;

app.use(bodyPaser.json());


app.get('/employees', (req, res) => EmployeeModel.find((err, employees) => {
  if (!err) {
    return res.send(employees);
  }
  res.statusCode = 500;
  console.error('Internal error(%d): %s', res.statusCode, err.message);
  return res.send({ error: 'Server error' });
}));

app.post('/employee', (req, res) => {
  const employee = new EmployeeModel({
    name: req.body.name,
    email: req.body.email,
    tel: req.body.tel,
    note: req.body.note,
  });
  employee.save((err) => {
    if (!err) {
      console.info('article created');
      return res.send({ status: 'OK', employee });
    }
    console.log(err);
    if (err.name === 'ValidationError') {
      res.statusCode = 400;
      return res.send({ error: 'Validation error' });
    }
    console.error('Internal error(%d): %s', res.statusCode, err.message);
    res.statusCode = 500;
    return res.send({ error: 'Server error' });
  });
});

app.get('/employee/:email', (req, res) => EmployeeModel.findOne({ email: req.params.email }, (err, employee) => {
  if (!employee) {
    res.statusCode = 404;
    return res.send({ error: 'Not found' });
  }
  if (!err) {
    return res.send({ status: 'OK', employee });
  }
  res.statusCode = 500;
  console.error('Internal error(%d): %s', res.statusCode, err.message);
  return res.send({ error: 'Server error' });
}));

app.put('/employee/:email', (req, res) => EmployeeModel.findById(req.params.email, (err, employee) => {
  if (!employee) {
    res.statusCode = 404;
    return res.send({ error: 'Not found' });
  }

  /* eslint-disable no-param-reassign */
  employee.name = req.body.name;
  employee.email = req.body.email;
  employee.tel = req.body.tel;
  employee.notice = req.body.notice;
  return employee.save((error) => {
    if (!error) {
      console.info('article updated');
      return res.send({ status: 'OK', employee });
    }
    if (error.name === 'ValidationError') {
      res.statusCode = 400;
      return res.send({ error: 'Validation error' });
    }
    res.statusCode = 500;
    console.error('Internal error(%d): %s', res.statusCode, error.message);
    return res.send({ error: 'Server error' });
  });
}));

app.delete('/employee/:email', (req, res) => {
  console.log(req.params);
  return EmployeeModel.findOne({ email: req.params.email }, (err, employee) => {
    if (!employee) {
      res.statusCode = 404;
      return res.send({ error: 'Not found' });
    }
    return employee.remove((error) => {
      if (!error) {
        console.info('employee removed');
        return res.send({ status: 'OK' });
      }
      res.statusCode = 500;
      console.error('Internal error(%d): %s', res.statusCode, error.message);
      return res.send({ error: 'Server error' });
    });
  });
});

app.use('/', router);
app.listen(3000, () => console.log('localhost:3000'));
