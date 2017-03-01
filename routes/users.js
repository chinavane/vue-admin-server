var express = require('express');
var router = express.Router();
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');
var secret = 'secret 128 string';
var moment = require('moment');
var userCtrl = require('../controllers/user.controller')
var User = require('../models/user.model')


router.get('/', userCtrl.list);
router.post('/', userCtrl.create);
router.get('/:id', userCtrl.get);
router.put('/:id',userCtrl.update);
router.delete('/:id',userCtrl.remove);

router.post('/refresh_token',function(req,res,next){
    var token = req.body.token;
    jwt.verify(token, secret, function(err, decoded) {
      if(err) {
        res.send(401)
      }else{
        var user = {
            userName:decoded.userName
        }
        var expires = moment().add(1, 'm').utcOffset(8).format('x');
        var token =  jwt.sign(user, secret, { expiresIn: 60*1 })
        res.json({"msg":"yes","userName":decoded.userName,"token":token,"expires":expires});
      }
    });
});

router.post('/login',function(req,res,next){
    User.find({userName:req.body.userName,userPwd:req.body.userPwd}).then(function(results){
        if(results.length>0){
            var user = {
                userName:results[0].userName
            }
            var expires = moment().add(1, 'm').utcOffset(8).format('x');
            var token =  jwt.sign(user, secret, { expiresIn: 60*1 })
            res.json({"msg":"yes","userName":results[0].userName,"token":token,"expires":expires});
        }else{
            // res.send(401);
            // res.sendStatus(401);
            res.send(401, {status:401, message: '用户名密码错误，请重新登录', type:'error'});

            // res.json({"msg":"用户名密码错误，请重新登录"});
        }
    })
});

module.exports = router;
