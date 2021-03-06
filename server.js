require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const adminRoutes = require('./server/routes/admin')
const authRoutes = require('./server/routes/auth');
const userRoutes = require('./server/routes/user')
const path = require('path')


const dataBasePassword = process.env.dataBasePassword
const dataBaseUser = process.env.dataBaseUser
const cluster = process.env.cluster

const DB_URI = 'mongodb+srv://'+dataBaseUser+':'+dataBasePassword+'@'+cluster;

const app = express();
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'build')))

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(userRoutes);


app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

mongoose
    .connect(
        DB_URI,
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
    .then(() => app.listen(port))
    .catch(err => console.log(err))
