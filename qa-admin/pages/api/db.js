import AppDAO from "../../db.js"
var path = "/user-data/user.db"



export default async function handler(req, res){ 
    var body = req.body;
    var dao;
    var email = body.email;
    console.log("email",email);
    try{
        const fs = require('fs');

        if (!fs.existsSync(path)) {
            //file not exists
            throw 'Database not exist';
  
        }else{
            dao = new AppDAO(path);
            dao.all(`SELECT * FROM user WHERE user.email='${email}';`).then(function(hash){
                if (hash && hash != []){
                    res.status(200).json({"hash":hash[0]});
                }else{
                    res.status(500).json({error:"no this user"})
                }
            });



        }
        
        

        
    } catch(e){
        console.error(e)
        res.status(500).json({error:e})
        
    }
}
