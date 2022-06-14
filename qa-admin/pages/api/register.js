import AppDAO from "../../db.js"
var path = "/user-data/user.db"



export default async function handler(req, res){ 
    var body = req.body;
    var dao;

    try{
        
        const fs = require('fs');
          if (!fs.existsSync(path)) {
            //file not exists
            console.log("create table");
            dao = new AppDAO(path);
            var insertTables = async function() { 
                await dao.run('CREATE TABLE user(email TINYTEXT NOT NULL, password TINYTEXT, name TINYTEXT, admin BOOLEAN, PRIMARY KEY (email));');
            
            };
          }else{
            dao = new AppDAO(path);
          }
        
        insertTables().then( myfunc => {
            dao.run(`INSERT INTO user VALUES("${body.email}", "${body.password}", "${body.name}", ${body.admin});`)

        })
        
    } catch(e){
        // means the table exists
        
        console.error("Use existing tables")
        dao.run(`INSERT INTO user VALUES("${body.email}", "${body.password}", "${body.name}", ${body.admin});`)


        
    } finally{
        console.log("body",body);
        res.status(200).json({"value":"ok"});

    }
}
