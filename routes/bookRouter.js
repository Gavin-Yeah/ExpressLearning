var express = require('express');
var router = express.Router();
let sqlQuery = require('../lcmysql');
//登陆

function isLoginMid(req,res,next){
    if(req.session.username == undefined){

        res.render('info.ejs',{title:'未登陆',
        content:'尚未登陆，请进入登陆页面',
            href:'/login',
            hrefTxt:'登陆页'
        });
    }else{
        next();
    }
}


router.get('/out/logout',(req,res)=>{
    req.session.destroy(function (err) {
        if(err)console.log(err);

    })
    res.send('logout success');
})

router.get('/:bookid',isLoginMid,async(req,res)=>{
    req.session.username = 'cpeng';


    let strSql = "select * from books where id=?";
    let bookid = req.params.bookid;
    let result = await sqlQuery(strSql,[bookid]);
    let options = {book:result[0]};
    res.render('bookInfo.ejs',options);
});

module.exports = router;