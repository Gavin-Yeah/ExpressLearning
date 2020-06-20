var express = require('express');
var router = express.Router();
var fs = require('fs');
//引入上传模块
let multer = require('multer');
//配置上传对象
let upload = multer({dest:'./public/upload'});
/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('uploadImg.ejs');

   //因为字节上传的文件为随即名字 我们想要重新命名

});
router.get('/ajax',(req,res)=>{
    res.render('uploadAjax.ejs');
});
//处理上传的post请求
//若果上传单个文件，可调用upload.single()方法 并且将表单文件的name值传入
// router.post('/',upload.single('imgfile'),(req,res)=>{
//     console.log(req.file);
//     let oldPath = req.file.destination+'/'+req.file.filename;
//     let newPath = req.file.destination+'/'+req.file.filename + req.file.originalname;
//     fs.rename(oldPath,newPath, ()=>{
//         console.log('rename success');
//     });
//     res.send("<h1>upload success</h1> <img src='/upload/"+req.file.filename+req.file.originalname+"' alt=''>");
// });
router.post('/',upload.single('imgfile'),(req,res)=>{
    console.log(req.file);
    let oldPath = req.file.destination+'/'+req.file.filename;
    let newPath = req.file.destination+'/'+req.file.filename + req.file.originalname;
    fs.rename(oldPath,newPath, ()=>{
        console.log('rename success');
    });
    res.json({
        state:'ok',
        imgUrl:'/upload/'+req.file.filename+req.file.originalname
    });
});




module.exports = router;
