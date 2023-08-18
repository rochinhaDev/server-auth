import express from "express";
import isAuth from "../middlewares/isAuth.js";
import JobModel from "../model/job.model.js";
import BusinessModel from "../model/business.model.js";
import UserModel from "../model/user.model.js";
const jobRouter = express.Router();
jobRouter.post("/create", isAuth, async (req, res) => {
  try {
    const form = req.body;
    const id_business = req.auth._id;
    const jobCreated = await JobModel.create({
      ...form,
      business: id_business,
    });
    await BusinessModel.findByIdAndUpdate(id_business, {
      $push: { offers: jobCreated._id },
    });
    return res.status(201).json(jobCreated);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.get("/:id_job", isAuth, async (req, res) => {
  try {
    const id_job = req.params.id_job;
    const job = await JobModel.findById(id_job)
      .populate({
        path: "business",
        select: "name email telefone description",
      })
      .populate({
        path: "candidates",
        select: "name email telefone",
      });
    return res.status(200).json(job);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.get("/all/open", isAuth, async (req, res) => {
  try {
    const jobsOpen = await JobModel.find({
      status: "ABERTA",
    });
    return res.status(200).json(jobsOpen);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.put("/edit/:id_job", isAuth, async (req, res) => {
  try {
    const id_job = req.params.id_job;
    const form = req.body;
    const updatedJob = await JobModel.findByIdAndUpdate(
      id_job,
      { ...form },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedJob);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.delete("/delete/:id_job", isAuth, async (req, res) => {
  try {
    const id_job = req.params.id_job;
    const deletedJob = await JobModel.findByIdAndUpdate(
      id_job,
      { status: "CANCELADA" },
      { new: true, runValidators: true }
    );
    return res.status(200).json(deletedJob);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.post("/apply/:id_job", isAuth, async (req, res) => {
  try {
    const id_job = req.params.id_job;
    const id_user = req.auth._id;
    await JobModel.findByIdAndUpdate(id_job, {
      $push: { candidates: id_user },
    });
    await UserModel.findByIdAndUpdate(id_user, {
      $push: { history: id_job },
    });
    return res
      .status(200)
      .json({ message: "Voce se candidatou para essa vaga com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
jobRouter.post(
  "/approved-candidate/:id_job/:id_user",
  isAuth,
  async (req, res) => {
    try {
      const id_job = req.params.id_job;
      const id_user = req.params.id_user;
      await JobModel.findByIdAndUpdate(id_job, {
        select_candidate: id_user,
        status: "FECHADA",
      });
      return res
        .status(200)
        .json({ message: "Candidato Aprovado! - Esta vaga foi fechada" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);
export default jobRouter;
