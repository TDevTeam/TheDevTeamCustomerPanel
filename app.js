require('dotenv').config();
const express = require('express');
const { connect, connection, Schema, model } = require("mongoose");
const { urlencoded, json } = require("express");

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(urlencoded({ extended: true }));
app.use(json());

connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

const userSchema = new Schema({
    username: String,
    password: String
});

const User = model('User', userSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (user) {
        res.redirect('/home');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
