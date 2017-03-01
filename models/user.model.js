const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
      userName:String,
      trueName:String,
      nickName:String,
      userPwd:String,

      addressDetail:String,
      fixedPhone:String,
      mobilePhone:String,
      weixin:String,
      qq:String,
      email:String,
      remark:String,

      token:String,
      uuid:String,

      roleProperty:{ type: Number, default: 0 },
      provincedId:{ type: Number, default: 0 }, // 省
      cityId:{ type: Number, default: 0 }, // 市
      districtId:{ type: Number, default: 0 }, // 区
      gender:{ type: Number, default: 0 }, // 性别
      avatar:{ type: Number, default: 0 },  // 头像
      sortID:{ type: Number, default: 0 }, // 排序
      isDelete:{ type: Number, default: 0 }, // 删除

      birthday:Date,
      createDateTime:{ type: Date, default: Date.now },
      lastLoginDateTime:{ type: Date, default: Date.now }
});

module.exports =  mongoose.model('User', UserSchema);
