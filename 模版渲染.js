
let express = require('express');
//使用模版来渲染页面
let ejs = require('ejs');

let app = express();
app.set('views', 'views');//设置视图的对应目录
app.set('view engine', 'ejs');//设置默认的模版引擎
app.engine('ejs', ejs.__express);//定义模版引擎


let sqlQuery = require('./lcmysql');
app.get('/', async (req, res) => {
    //插入变量
    let options = {
        title: 'homepage',
        articleTitle:"<h1>文章标题</h1>"
    }
    res.render('index.ejs',options);
})


app.get('/xiaoshuowenxue', async (req, res) => {
    let options = {
        'username':'小明',
        'gender':'男'
    }
    //条件
    res.render('condition.ejs',options);
})
app.get('/books/:bookid', async (req, res) => {
    //循环
    let stars = ['蔡徐坤','郭敬明','吴亦凡','鹿晗'];

    res.render('xh.ejs',{stars});
})
app.listen(8080);

module.exports = app;