var express = require('express');
var router = express.Router();
let sqlQuery = require('../lcmysql');
//登陆
var crypto = require('crypto');



router.get('/', (req,res)=>{
    res.render('register.ejs')
});
router.post('/',async function (req,res) {
   let {email,password,username} = req.body;
   password = encrypt(password);
   // console.log(req.body)
    //判断邮箱是否已注册，如果已注册，将不再注册
    let strSql = 'select * from user where email=?';
    let result = await sqlQuery(strSql,[email]);
    if(result.length!==0){
        res.render('info',{
            title:'register failure',
            content:'email exists',
            href:'/register',
            hrefTxt:'register page'
        });
    }else{
        strSql = 'insert into user (username, email,password) values (?, ?, ?)';
        await sqlQuery(strSql, [username, email, password]);
        res.render('info',{
            title:'register success',
            content:'registration success',
            href:'/login',
            hrefTxt:'login page'
        });
    }
    

})

function encrypt(str){
    let salt = "vsdfvsdfvs";
    let obj = crypto.createHash('md5');
    str +=salt;
    obj.update(str);
    return obj.digest('hex');
}

module.exports = router;