
let sqlQuery = require('./lcmysql');
var express = require('express');
let cookieParser = require('cookie-parser');
const session = require('express-session');
var path = require('path');
var createError = require('http-errors');
var app = express();


var bookRouter = require('./routes/bookRouter');
var loginRouter = require('./routes/loginRouter');
var registerRouter = require('./routes/registerRouter');
var uploadRouter = require('./routes/uploadRouter');
var downloadRouter = require('./routes/downloadRouter');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//session 配置
app.use(session({
    secret:"salt",
    cookie:{maxAge:7*24*60*1000}, //设置session 有效期为1周
    resave:true,
    saveUninitialized:true

}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req,res)=>{


    let sqlStr = "select * from books limit 0,28";


    let result = await sqlQuery(sqlStr);

    //获取总页数
    let sqlStr1 = "select count(id) as num from books";
    let result1 = await sqlQuery(sqlStr1);
    let pageAll = Math.ceil(parseInt(result1[0].num)/28);
    let startPage =1;
    let endPage = (1+5)>pageAll?pageAll:(1+5);

    let options = {
        books:result,
        category: await getCategory(),
        pageAll,
        page:1,

        startPage,
        endPage
    };
    res.render('bookIndex.ejs',options);
    //res.json(options)
});


app.get('/page/:pid', async (req,res)=>{
    let page = parseInt(req.params.pid);

    let sqlStr = "select * from books limit ?,28";
    let arr = [28*(page-1)];

    let result = await sqlQuery(sqlStr,arr);

    //获取总页数
    let sqlStr1 = "select count(id) as num from books";
    let result1 = await sqlQuery(sqlStr1);
    let pageAll = Math.ceil(parseInt(result1[0].num)/28);
    let startPage =(page-4)<1?1:(page-4);
    let endPage = (page+5)>pageAll?pageAll:(page+5);

    let options = {
        books:result,
        category: await getCategory(),
        pageAll,
        page,

        startPage,
        endPage
    };
    res.render('bookIndex.ejs',options);
    //res.json(options)
});

app.use('/books',bookRouter);
app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.use('/imgUpload',uploadRouter);
app.use('/download',downloadRouter);
//设置搜索的路由
app.get('/search/:searchKey/page/pid',async(req,res)=>{
    let page = parseInt(req.params.pid);
    let searchKey = req.params.searchKey;
    let sqlStr = 'select * from books where bookname like "%'+searchKey+'%" or author like "%'+searchKey+'%" or category like "%'+searchKey+'%" limit ?,28';

    let result = await sqlQuery(sqlStr,[searchKey,28*(page-1)]);
    //获取总页数
    let sqlStr1 =  'select count(id) as num from books where bookname like "%'+searchKey+'%" or author like "%'+searchKey+'%" or category like "%'+searchKey+'%" ';
    let result1 = await sqlQuery(sqlStr1);
    let pageAll = Math.ceil(parseInt(result1[0].num)/28);
    let startPage =(page-4)<1?1:(page-4);
    let endPage = (page+5)>pageAll?pageAll:(page+5);

    let options = {
        books:result,
        category: await getCategory(),
        pageAll,
        page,

        startPage,
        endPage
    };
    // res.json(options)
})

app.get('/category/:cid',async (req,res)=>{
    let sqlStr = "select * from books where category in (select name from category where id = ?)";
    let cid = req.params.cid;
    let result = await sqlQuery(sqlStr,[cid]);
    let options = {
        books:result,
        category: await getCategory()
    };
    res.render('bookCate.ejs',options);
})

app.get('/category/:cid/page/:pid',async (req,res)=>{
    let page = parseInt(req.params.pid);

    let sqlStr = "select * from books where category in (select name from category where id = ?) limit ?,28";
    let arr = [req.params.cid,28*(page-1)];

    let result = await sqlQuery(sqlStr,arr);

    //获取总页数
    let sqlStr1 = "select count(id) as num from books where category in (select name from category where id = ?)";
    let result1 = await sqlQuery(sqlStr1,[req.params.cid]);
    let pageAll = Math.ceil(parseInt(result1[0].num)/28);
    let startPage =(page-4)<1?1:(page-4);
    let endPage = (page+5)>pageAll?pageAll:(page+5);
    let cid = req.params.cid;
    let options = {
        books:result,
        category: await getCategory(),
        pageAll,
        page,
        cid,
        startPage,
        endPage
    };
    res.render('bookCate.ejs',options);
    //res.json(options)
})



async function getCategory(){
    let sqlStr = "select * from category";
    let result  = await sqlQuery(sqlStr);
    return Array.from(result);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {

    next(createError(404));
});

// error handler
//处理错误的中间件
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('404.ejs');
});


module.exports = app;
