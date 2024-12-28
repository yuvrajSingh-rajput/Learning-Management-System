import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchase.route.js";
import courseProgressRoute from "./routes/course-progress.route.js";
import cors from "cors";
import path from "path";

dotenv.config({});
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

const _dirname = path.resolve();

// default middleware 
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://learning-management-system-2-rt4f.onrender.com",
    credentials: true,
}));

// routes 
app.use('/api/v1/media', mediaRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/purchase', purchaseRoute);
app.use('/api/v1/progress', courseProgressRoute);

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (_, res) => {
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});


// stripe listen --forward-to http://localhost:3000/api/v1/purchase/webhook