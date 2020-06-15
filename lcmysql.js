const mysql = require('mysql');
let options = {
    host: 'localhost',
    //port:'3306', //可选 默认3306
    user: 'root',
    password: 'jiada119',
    database: 'book'
};
//创建与数据库连接的对象
let con = mysql.createConnection(options);
// console.log(con);
//建立连接
con.connect((err) => {
    //如果建立连接失败
    if(err)console.log(err)
    console.log('数据库启动成功')
})

function sqlQuery(strSql, arr){
    return new Promise(function (resolve, reject) {
        con.query(strSql,arr,(err,result)=>{
            if(err){
                reject(err);
            }else{resolve(result);
            }
        })

    })}
    module.exports=sqlQuery;