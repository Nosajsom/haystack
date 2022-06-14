import { withIronSession } from "next-iron-session";
import { setCookie } from 'nookies'

async function handler(req, res) {
  // get user from database then:
  try{
    var body = req.body;
    req.session.set("user", {
      name: body.name,
      email: body.email,
      admin: body.admin,
    });
    await req.session.save();
    console.log("Logged in");
    
    setCookie({ res }, 'user', body.email, {
      maxAge: 365 * 24 * 60 * 60, // Cookie lasts a year
      path: '/',
      httpOnly: false,
    });

    res.status(200).json({"res":"okay"})

    return;
  } 
  catch(e){
    console.error(e)
    res.status(500).json({error:e})
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