require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose");
const _ = require("lodash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/societyDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// USER MANAGEMENT
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// USER MANAGEMENT END
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String
});

const wingSchema = new mongoose.Schema({
    wingName: Array
});

const contact = mongoose.model("Contact", contactSchema);
const wing = mongoose.model("Wing", wingSchema);

app.get("/", function (req, res) {
    res.render("home");
})

app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        req.login(user, function (err) {
            if (err) {
                console.log(err);

            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/dashboard");
                });
            }
        });

    });

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })

    .post(function (req, res) {
        User.register({
            username: req.body.username
        }, req.body.password, function (err) {
            if (err) {
                console.log(err);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/dashboard");
                })
            }
        });

    });

app.route("/contact-us")
    .get(function (req, res) {
        res.render("contact-us");
    })
    .post(function (req, res) {
        const message = new contact({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            subject: req.body.subject
        });
        message.save();
        res.redirect("/");
    });

app.route("/dashboard")
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            res.render("dashboard");
        } else {
            res.render("login");
        }
    });


app.get("/dashboard/:formName", function (req, res) {
    if (req.isAuthenticated()) {
        res.render(req.params.formName);
    } else {
        res.render("login");
    }
});

app.post("/dashboard/wing-master", function (req, res) {
    const wings = new wing;

    const values = Object.values(req.body.wingName);
    values.forEach(function (result) {

        wings.wingName.push(result.wing);
    });
    wings.save();
    res.redirect("/dashboard");
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});