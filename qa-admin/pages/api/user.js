import { withIronSession } from "next-iron-session";

function handler(req, res, session) {
  console.log("Inside");
  
  try{
    const user = req.session.get("user");
    console.log(user);
    if (user){  
      res.status(200).json({"user":user})

    }else{
      res.status(200).json({"user":'Not found'})
    }
    return;
  } 
  catch(e){
    console.error(e)
    res.status(200).json({"user":'Not found'})
  }

}

export default withIronSession(handler, {
  password: "complex_password_at_least_32_characters_long",
  cookieName: "myapp_cookiename",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    //secure: process.env.NODE_ENV === "production",
  },
});