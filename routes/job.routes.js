import express from "express";
import isAuth from "../middlewares/isAuth.js";
const jobRouter = express.Router();
jobRouter.post("/create", isAuth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.get("/:id_job", isAuth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.get("/all/open", isAuth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.put("/edit/:id_job", isAuth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.delete("/delete/:id_job", isAuth, async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
export default jobRouter;
