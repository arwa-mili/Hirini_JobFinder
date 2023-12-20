import express from "express";
import multer from 'multer';
import userAuth from "../middlewares/authMiddleware.js";
import
{
  applyNow,
  createJob,
  deleteJobPost,
  getJobById,
  getJobsByCompanyId,
  getJobPosts,
  updateJob,
} from "../controllers/jobController.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb)
  {
    cb(null, "./files");
  },
  filename: function (req, file, cb)
  {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();

// POST JOB
router.post("/upload-job", userAuth, createJob);

// UPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// GET JOBS BY COMPANY
router.get("/get-jobs-by-company/:_id", getJobsByCompanyId);

// GET JOB POST
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);
//apply
router.post("/get-job-detail/:id/apply", upload.single('pdf'), applyNow);

// DELETE JOB POST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

export default router;
