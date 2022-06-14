import { withIronSession } from "next-iron-session";

async function handler(req, res, session) {

  
  try{
    await req.session.destroy();
    var body = req.body;
    console.log("body update",body);
    await req.session.set("user", {
      name: body.name,
      email: body.email,
      admin: body.admin,
    });
    await req.session.save();
    console.log("Session has updated");
    
    
    
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