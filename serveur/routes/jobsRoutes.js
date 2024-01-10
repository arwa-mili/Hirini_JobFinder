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
  deleteJobApplication,
  updateJob,
  updateJobApplication
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

router.get("/download/:filename", (req, res) =>
{
  const { filename } = req.params;
  const filePath = `./files/${filename}`;

  res.download(filePath, (err) =>
  {
    if (err)
    {
      // Handle error, such as file not found
      console.error(err);
      res.status(404).json({ error: "File not found" });
    }
  });
});


// POST JOB
router.post("/upload-job", userAuth, createJob);

// UPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// GET JOBS BY COMPANY
router.get("/get-jobs-by-company/:_id", getJobsByCompanyId);


// UPDATE JOB APPLICATION
router.put("/update-job-application/:jobId/:applicantId", updateJobApplication);

// GET JOB POST
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);
//apply
router.post("/get-job-detail/:id/apply", upload.single('pdf'), applyNow);

// DELETE JOB POST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

//DELETE JOB APPLICATION
router.delete("/delete-job-application/:jobId/:applicantId", deleteJobApplication);


export default router;
