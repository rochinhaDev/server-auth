import express from "express";
import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config copy.js";
import isAuth from "../middlewares/auth.js";

const userRouter = express.Router();

const SALT_ROUNDS = 10;

userRouter.post("/signup", async (req, res) => {
   try {
      const form = req.body;

      //confirmar se foi enviado os campos email e password
      if (!form.email || !form.password) {
         return res.status(400).json({
            msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
         });
      }

      //confirmar que a senha tem pelo menos 8 caracteres, uma letra maiuscula, uma minuscula, um numero e um caracter especial
      if (
         !form.password.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
         )
      ) {
         return res.status(400).json({
            msg: "Senha não corresponde aos requisitos minimos.",
         });
      }

      //fazer a criptografia da senha (string aleatória que vai deixar a senha mais segura)
      const salt = await bcrypt.genSalt(SALT_ROUNDS);

      // juntar essa string aleatória com a senha do usuario e gerar um hash
      const hashedPassword = await bcrypt.hash(form.password, salt);

      //criar o usuario no banco de dados
      const createdUser = await UserModel.create({
         ...form,
         passwordHash: hashedPassword,
      });

      //remover o passwordHash do objeto de resposta
      createdUser.passwordHash = undefined;

      return res.status(201).json(createdUser);
   } catch (error) {
      console.log(error);
      return res.status(500).json(error);
   }
});

userRouter.post("/login", async (req, res) => {
   try {
      const form = req.body;

      //confirmar se foi enviado os campos email e password
      if (!form.email || !form.password) {
         throw new Error("Email ou senha invalidos.");
      }

      //buscar o usuario no banco de dados pelo seu email
      const user = await UserModel.findOne({ email: form.email });

      //se o usuario não existir, retornar um erro
      if (!user) {
         throw new Error("Nenhum usuario encontrado com esse email.");
      }

      //comparar a senha enviada com a senha criptografada do usuario
      if (await bcrypt.compare(form.password, user.passwordHash)) {
         //remover o passwordHash do objeto de resposta
         user.passwordHash = undefined;

         //se as senhas são iguais, gerar um token com as informações do usuario
         const token = generateToken(user);

         //retornar o usuario e o token
         return res.status(200).json({
            user: user,
            token: token,
         });
      } else {
         throw new Error("Email ou senha invalidos, tente novamente.");
      }
   } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
   }
});

userRouter.get("/profile", isAuth, async (req, res) => {
   try {
      const userId = req.auth._id;

      const user = await UserModel.findById(userId).select("-passwordHash");

      return res.status(200).json(user);
   } catch (err) {
      console.log(err);
      return res.status(500).json(err);
   }
});

export default userRouter;
