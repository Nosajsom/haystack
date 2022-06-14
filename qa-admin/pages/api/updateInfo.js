import AppDAO from "../../db.js"
var path = "/user-data/user.db"



export default async function handler(req, res){ 
    var body = req.body;
    var dao;
    console.log("body",body);
    try{ 
        dao = new AppDAO(path);
        console.log("bodyname",body.name);
        dao.run(`UPDATE user SET name="${body.name}" WHERE user.email="${body.email}";`)
        console.log("Update user finished");
        
    } catch(e){
        // means the table exists
        console.log("e",e)
        res.status(500).json({"value":"error"});
        return;
        


        
    } 
        
    res.status(200).json({"value":"ok"});

    
}
