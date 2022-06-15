// libray
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const md5 = require('md5');

//model
const User = require('./models/user');
const Patient = require('./models/patient');

const app = express();

// connect với db
mongoose.connect(process.env.MONGO_URI, {
  keepAlive: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
}, (err) => {
  if (err) console.log('DB is down');
  console.log('DB is ready!!!');
})

// set enviroment
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// cho phép call api 
// app.use(cors);


// route
app.get('/', (req, res, next) => {
  res.json({ message: 'application_connected' });
});

// login
app.post('/api/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // get user wit username
    const user = await User.findOne({ username }).lean();

    // is user accout exist
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: httpStatus['401_NAME']
      });
    }

    // check user password
    if (password !== user.password) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: httpStatus['401_NAME']
      });
    }

    res.json({ token: `Basic ${md5(username)}`, user });
  } catch (error) {
    next(error)
  }
});


app.get('/api/patients', async (req, res, next) => {
  try {
    const { skip = 0, limit = 10 } = req.query;
    const patients = await Patient.find({}, {}, { skip, limit });
    res.json(patients);
  } catch (error) {
    next(error)
  }
});

app.get('/api/patients/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const patients = await Patient.find({ owner_id: id });
    res.json(patients);
  } catch (error) {
    next(error)
  }
});

app.post('/api/patients/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { temp } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: httpStatus['400_NAME']
      });
    }

    const patient = await Patient.create({ temp: Number(temp) || 0, owner_id: id });
    res.status(httpStatus.CREATED).json(patient);
  } catch (error) {
    next(error)
  }
});


// run project
app.listen(process.env.PORT, () => {
  console.log('Project healthcare running on port:', process.env.PORT);
})