let mysql = require('mysql');
let sqlQuery = require('./lcmysql');
let express= require('express');

let app = express();

app.get('/',async (req,res)=>{
    let strSql = "select id, bookimg, bookname, author, category from books limit 0,28";
    let result = await sqlQuery(strSql);
    // let resJson = JSON.stringify(Array.from(result));
    // res.send(resJson);
    res.json(Array.from(result));
})


app.get('/xiaoshuowenxue',async (req,res)=>{
    let strSql = "select id, bookimg, bookname, author, category from books where category= '爱情' limit 0,28";
    let result = await sqlQuery(strSql);
    res.json(Array.from(result));
})
app.get('/books/:bookid',async (req,res)=>{
    let strSql = "select id, bookimg, bookname, author, category from books where id=?";
    let bookid = req.params.bookid;
    let result = await sqlQuery(strSql,[bookid]);
    res.json(Array.from(result));
})
app.listen(8080);

module.exports = app;