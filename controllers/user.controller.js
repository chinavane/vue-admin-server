var User = require('../models/user.model')
const _=require('lodash');
const {ObjectID} = require('mongodb');
const mongoose = require('mongoose');

exports.create = function (req, res, next) {
  user.save(req.query)
  .then(savedUser => res.json(savedUser))
  .catch(e => next(e));
}

exports.update = function (req, res, next) {
  var id = req.params.id;
  // var sid = mongoose.Types.ObjectId(id);
  var _id = mongoose.mongo.ObjectId(id);

  // 只更新text及completed字段
  var body=_.pick(req.body,['userName','trueName']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  User.findById(id).then(users => {
    res.json(users)
  }).catch((e)=>{
    res.send(e)
  });


  // User.findByIdAndUpdate(id,{$set:body},{new:true})
  // .then((user)=>{
  //   if(!user){
  //     return res.status(404).send();
  //   }
  //   res.send({user});
  // })
  // .catch((e)=>{
  //   //error
  //   res.status(400).send();
  // });

};

exports.list = function (req, res, next) {
  User.find().then(users => {
    res.json(users)
  })
  .catch(e => next(e));
};

exports.remove = function (req, res, next) {
  User.find({_id:req.params.id}).then(users => {
    User.remove(users).then(users =>{
      res.json(users)
    })
  })
  .catch(e =>next(e));
}