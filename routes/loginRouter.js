var express = require('express');
var router = express.Router();
let sqlQuery = require('../lcmysql');
//登陆

let {encrypt} =require('./cookie');


router.get('/', (req,res)=>{
    res.render('login.ejs')
});
router.post('/',async function (req,res) {
    console.log(req.body);
    //根据提交的邮箱和密码 判断是否是正确的账号密码
    let password = encrypt(req.body.password);
    const strSql = "select * from user where email=? and password =?";
    let arr = [req.body.email,password];
    let result = await sqlQuery(strSql,arr);
    if(result.length!==0){
        let user = result[0];
        req.session.username = user.username;
        res.render('info',{
            title:'login success',
            content:'correct account, goto detail page',
            href:'/',
            hrefTxt:'homepage'
        });
    }else{
        res.render('info',{
            title:'login failture',
            content:'wrong account, goto login page',
            href:'/login',
            hrefTxt:'loginPage'
        });

    }

})



module.exports = router;