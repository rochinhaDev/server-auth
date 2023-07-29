import jwt from "jsonwebtoken";

export default function generateToken(user) {
   //informações que serão salvas no token
   const { _id, name, email, role } = user;

   const signature = process.env.TOKEN_SIGN_SECRET;
   const expiration = "12h";

   return jwt.sign({ _id, name, email, role }, signature, {
      expiresIn: expiration,
   });
}
