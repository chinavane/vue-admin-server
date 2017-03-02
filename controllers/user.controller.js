const {ObjectID} = require('mongodb');
const mongoose = require('mongoose');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const _ =require('lodash');
const User = require('../models/user.model')
const secret = 'secret 128 string';

// 新建用户
exports.create = function (req, res, next) {
  const user = new User(req.body);
  user.save()
  .then(savedUser => {
    res.json(savedUser)
  })
  .catch(e => next(e));
};

// 获取某个用户
exports.get = function (req, res, next) {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  User.findById(id)
  .then(user => {
    res.json(user)
  })
  .catch(e => {
    next(e)
  });
};

// 更新用户
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

// 用户列表分页操作
exports.list = function (req, res, next) {
  var page = (req.query.page != undefined ) ? parseInt(req.query.page) : 1;
  var limit = (req.query.limit != undefined ) ? parseInt(req.query.limit) : 10;
  User.paginate({}, { page: page , limit: limit }, function(err, users) {
   res.send(users);
  });
};

// 删除用户
exports.remove = function (req, res, next) {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  User.findByIdAndRemove(id, function(err, user) {
    if (err || user === null) {
      return res.status(404).send({status:404, "msg":"未找到该用户或该用户已被删除","type":"warning"});
    };
    res.json(200, user);
  }).catch(e=>{
    res.status(400).send();
  });
};

// 刷新Token值
exports.refresh_token = function(req,res,next){
  var token = req.body.token;
  jwt.verify(token, secret, function(err, decoded) {
    if(err) {
      res.status(401).send();
    }else{
      // 通过_id查询用户是否存在，找到用户并将userPwd剔除
      var id = decoded._doc._id;
      User.findById(id,{userPwd:0})
      .then(user => {
        var expires = moment().add(1, 'm').utcOffset(8).format('x');
        var token =  jwt.sign(user, secret, { expiresIn: 60*1 })
        res.json({"msg":"yes","userName":decoded.userName,"token":token,"expires":expires});
      })
      .catch(e => {
        next(e)
      });

    }
  });
};

// 登录系统
// userPwd:0将把该字段从返回内容中剔除
exports.login = function(req,res,next){
  User.findOne({ userName:req.body.userName,userPwd:req.body.userPwd},
    {userPwd:0},function (err, user) {
    if(err){
      res.status(400).send();
    }
    if(user){
      // 生成设置有效期的Token值
      var expires = moment().add(1, 'm').utcOffset(8).format('x');
      var token =  jwt.sign(user, secret, { expiresIn: 60*1 })
      res.json({"msg":"登录成功","userName":user.userName,"token":token,"expires":expires});
    }else{
      res.send(401, {status:401, message: '用户名密码错误，请重新登录', type:'error'});
    }
  });
};