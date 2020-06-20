var express = require('express');
var router = express.Router();
var sqlQuery = require('../lcmysql');
/* GET users listing. */


router.get('/dl/:bookid', async function (req, res, next) {

    let bookid = req.params.bookid;
    //通过bookid查询数据库，获取本地下载路径
    let result = await sqlQuery("select localdownload from books where id=?;",[bookid]);
    let localPath = result[0].localdownload;
    await res.download(localPath);
    // res.send('download success');


});

module.exports = router;
