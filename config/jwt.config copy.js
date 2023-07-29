import jwt from "jsonwebtoken";

export default function generateToken(user) {
   const signature = process.env.TOKEN_SIGN_SECRET;

   //gerar token
   const token = jwt.sign(
      {
         _id: user._id,
      },
      signature,
      {
         expiresIn: "1d",
      }
   );

   return token;
}
