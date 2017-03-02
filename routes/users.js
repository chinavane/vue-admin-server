var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user.controller')
var User = require('../models/user.model')


router.get('/', userCtrl.list);
router.post('/', userCtrl.create);
router.get('/:id', userCtrl.get);
router.put('/:id',userCtrl.update);
router.delete('/:id',userCtrl.remove);
router.post('/refresh_token',userCtrl.refresh_token);
router.post('/login',userCtrl.login);

module.exports = router;