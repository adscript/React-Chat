var express = require('express');
var router = express.Router();
const Chat = require('../models/chat');

// get All chat
router.get('/', function (req, res, next) {
  Chat.find().then(chatData => {
    res.json({
      error: false,
      chatData
    });
  }).catch(err => {
    res.json({
      error: true,
      message: err
    })
  })
});

router.post('/', function (req, res, next) {
  Chat.create({ id: req.body.id, name: req.body.name, chat: req.body.chat })
    .then(chatItem => {
      res.json({
        error: false,
        chatAdded: chatItem
      });
    }).catch(err => {
      res.json({
        error: true,
        message: err
      })
    })
});

router.delete('/:id', function (req, res, next) {
  Chat.findOneAndRemove({ id: req.params.id })
    .then(item => {
      res.json({
        error: false,
        chatDeleted: item
      });
    }).catch(err => {
      res.json({
        error: true,
        message: err
      })
    })
});

module.exports = router;
