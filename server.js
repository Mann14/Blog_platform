const express = require('express');
const cookie_parser = require('cookie-parser')
const path = require('path');
const port = 3000;
const db = require('./config/mongoose');
const Register = require('./model/register');
const Content = require('./model/content')
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("Public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath);
})
app.get('/signin', (req, res) => {
    const filePath = path.join(__dirname, 'login.html');
    res.sendFile(filePath);
})
app.get('/signup', (req, res) => {
    const filePath = path.join(__dirname, 'register.html');
    res.sendFile(filePath);
})
app.get('/dashboard', (req, res) => {
    const filePath = path.join(__dirname, 'dashboard1.html');
    res.sendFile(filePath);
})
app.get('/content', (req, res) => {
    const filePath = path.join(__dirname, 'content.html');
    res.sendFile(filePath);
})
app.post("/register", async (req, res) => {
    const dataToSave = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password
    }
    const { email } = req.body;
    const { password } = req.body;
    const { confirm_password } = req.body;

    try {
        const existingUser = await Register.findOne({ email }).exec();
        const existingpassword = await Register.findOne({ password }).exec();
        const existingconf_pass = await Register.findOne({ confirm_password }).exec();
        if (!existingUser && existingpassword === existingconf_pass) {
            Register.create(dataToSave)
            return res.redirect('/signin');
        }
        else {

            return res.redirect('/signup')
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})
app.post("/login", (req, res) => {
    const submittedEmail = req.body
    Register.findOne({ email:submittedEmail.email })
        .then(existingUser => {
            if (existingUser) {
                if (existingUser.password === submittedEmail.password) {
                    res.redirect('/dashboard');
                    return
                } else {
                    console.log("andar")
                    res.redirect('/signin')
                    return;
                }
            }
            else {
                console.log("bahar")
                res.redirect('/signin')
                return;
            }
        })
        .catch(error => {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        })
})
app.post('/new_content',(req,res)=>{
    const { title,img_url,content } = req.body;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const date = day+'/'+month+'/'+year;
    res.render('dashboard', { date,title, img_url, content });

})
app.listen(port, (err) => {
    if (err) {
        console.log("Error generated:", err);
        return;
    }
    console.log("app listening at port:", port);
})