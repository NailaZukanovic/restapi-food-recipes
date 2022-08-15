const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const recipeRoutes = require('./api/routes/recipes');
const categoryRoutes = require('./api/routes/category');
const userRoutes = require('./api/routes/user');

const MONGODB_URI = 'mongodb+srv://mongo:yKI4hF1bRag7TGLq@cluster0.tb2zz.mongodb.net/test'

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, Origin, X-Requested-With');
    if (req.method === 'OPTIONS') {
        setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
})

app.use('/recipes', recipeRoutes);
app.use('/category', categoryRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});
const PORT = process.env.PORT || 8000
mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(result => {
        app.listen(PORT);
        console.log(`App is started and listening on a port ${PORT}`);
    })
    .catch(err => {
        console.log(err);
    });


