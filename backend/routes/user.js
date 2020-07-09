const router = require('express').Router();
var express = require("express");
//const router = express.Router();
//var mongoose = require('mongoose');
let User = require('../models/users');
const auth = require('../middleware/auth')


// for signup
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
  } catch (e) {
      res.status(400).send(e)
  }
})

// error handler
router.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});





// for login
// here when using middleware auth to check if user is authenticated 

router.get('/users/myProfile', auth, async (req, res) => {
    res.send(req.user)
})


// for logging out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})







router.post('/users/login',async (req, res) => {
  try {
      const user = await User.findByCredentials(req.body.email , req.body.password)
  //    res.send(user)
  const token = await user.generateAuthToken()
  res.send({ user, token })
} catch (e) {
  res.status(400).send()
}
})




router.get('/users', async (req, res) => {
  try {
      const users = await User.find({})
      res.send(users)
  } catch (e) {
      res.status(500).send()
  }
})

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id

  try {
      const user = await User.findById(_id)

      if (!user) {
          return res.status(404).send()
      }

      res.send(user)
  } catch (e) {
      res.status(500).send()
  }
})

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['email', 'password']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

      if (!user) {
          return res.status(404).send()
      }

      res.send(user)
  } catch (e) {
      res.status(400).send(e)
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
      const user = await User.findByIdAndDelete(req.params.id)

      if (!user) {
          return res.status(404).send()
      }

      res.send(user)
  } catch (e) {
      res.status(500).send()
  }
})






module.exports = router;