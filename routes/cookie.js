var express = require('express');
var router = express.Router();
var crypto = require('crypto');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/setcookie',function (req, res) {
  //基础设置cookie 有效期为1个会话 浏览器关闭
  // res.cookie('isLogin','true',{maxAge:30000,httpOnly:true});
  //设置加密操作
  res.cookie('isLogin','true',{maxAge:30000,signed:true})
  res.send('cookie setup')
})

router.get('/admin',function (req,res) {
  if(req.cookies.isLogin==='true'){
    console.log(req.cookies)
    res.send('login success');
  }else{
    res.send('login failure');
  }
})
router.get('/adminSecret',function (req,res) {
  if(req.signedCookies.isLogin==='true'){
    console.log(req.cookies)
    res.send('login success');
  }else{
    res.send('login failure');
  }
})

//加密原理解析
router.get('/secret',(req,res)=>{
  //需要加密的字符串
  let password = '123456';
  //使用加密的算法
  let hash = crypto.createHash('md5');
  // 对字符串进行加密
  hash.update(password);
  //加密的二进制数据以字符串的形式显示
  let content = hash.digest('hex');
  res.send(content);

});
//自己定义加密cookie

router.get('/appSecret',(req,res)=>{
  let secreteStr = encrypt('true');
  res.cookie('register',secreteStr);
  //设置将加密的密文和明文内容
  setSecretCookie("true",secreteStr);
  res.send('cookie encryption success');
});
router.get('/getAppSecret',(req,res)=>{
  //获取加密后的密文
  let strSecret = req.cookies.register;
  content = getSecretCookie(strSecret);
  console.log('decrypt',content);
  res.send('decrypt: '+content);
});
let secretCookie ={};
function setSecretCookie(str,secretStr) {
  secretCookie[secretStr] = str;

}
function getSecretCookie(secretStr){
  return secretCookie[secretStr];
}
const randomNum = 'vsdfvsdfvs';
function encrypt(str){
  str= str+randomNum;
  let hash = crypto.createHash('md5');
  hash.update(str);
  let secretStr = hash.digest('hex');

  return secretStr;
}

module.exports = {encrypt};

