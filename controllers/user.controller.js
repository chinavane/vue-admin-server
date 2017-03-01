var User = require('../models/user.model')
const _=require('lodash');
const {ObjectID} = require('mongodb');
const mongoose = require('mongoose');


exports.create = function (req, res, next) {
  const user = new User(req.body);
  user.save()
  .then(savedUser => {
    res.json(savedUser)
  })
  .catch(e => next(e));
}

exports.get = function (req, res, next) {
  var id = req.params.id;
  User.findById(id)
  .then(user => {
    res.json(user)
  })
  .catch(e => {
    console.log(e)
    next(e)
  });
}

exports.update = function (req, res, next) {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  User.findByIdAndUpdate(id,{$set:req.body},{new:false})
  .then((user)=>{
    if(!user){
      return res.status(404).send();
    }
    res.send({user});
  })
  .catch((e)=>{
    res.status(400).send();
  });
};

exports.list = function (req, res, next) {
  var page = (req.query.page != undefined ) ? parseInt(req.query.page) : 1;
  var limit = (req.query.limit != undefined ) ? parseInt(req.query.limit) : 10;
  User.paginate({}, { page: page , limit: limit }, function(err, users) {
   res.send(users);
  });
};

exports.remove = function (req, res, next) {
  var id = req.params.id;

  User.findByIdAndRemove(id, function(err, user) {
    if (err || user === null) {
      return res.status(404).send({status:404, "msg":"未找到该用户或该用户已被删除","type":"warning"});
    };
    res.json(200, user);
  }).catch(e=>{
    res.status(400).send();
  });

}