import express from "express";
import UserModel from "../model/user.model.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
   try {
      return res.status(201).json();
   } catch (err) {
      console.log(err);
      return res.status(500).json(err);
   }
});

userRouter.post("/login", async (req, res) => {
   try {
   } catch (err) {
      console.log(err);
      return res.status(500).json(err);
   }
});

userRouter.get("/profile", async (req, res) => {
   try {
   } catch (err) {
      console.log(err);
      return res.status(500).json(err);
   }
});

export default userRouter;
