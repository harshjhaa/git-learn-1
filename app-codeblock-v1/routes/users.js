var express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../model/User')

router
  .get('/login', (req, res, next) => {
    let message = req.flash('message')
    res.render('login', { message })
  })
  .delete('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/')
  })
  .post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }))
  .get('/register', (req, res, next) => {
    let validation = req.flash("validation")
    res.render('register', { validation })
  })
  .post('/register', (req, res, next) => {
    try {

      console.log("gathering details")
      //applying validations
       if (req.body.name === "" || req.body.email === "" || req.body.password === "") {
        console.log("applying validations")
        req.flash('validation', 'Please fill all the fields')
        res.redirect('/users/register')
        return
      }

      let userDetails = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }
      const newUser = new User(userDetails)

      newUser.save((err) => {   // db.user.inersrtOne(user)
        req.flash('message', 'Registration Success')
        res.redirect('/users/login')
      })
    } catch (err) {
      console.log(err)
      res.redirect('/users/register')
    }
  });

module.exports = router;
