import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import medicationRoutes from './routes/meds.js';
import mediminderRoutes from './mediminder/medicationRoutes.js';
import profileRoutes from './routes/profiles.js';
import scheduleRoutes from './routes/schedules.js';
import reminderRoutes from './routes/reminders.js';
import "./jobs/reminderService.js";
import facilitiesRoutes from './routes/facilities.js';
import tagsRoutes from './routes/tags.js';
import postsRoutes from './routes/posts.js';
import contactRouter from './routes/emergencyCont.js'

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://svasthya.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Svasthya Backend Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/medication", medicationRoutes);
app.use("/api/mediminder", mediminderRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/facilities", facilitiesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/contacts", contactRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
