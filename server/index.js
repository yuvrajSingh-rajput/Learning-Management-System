import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import cors from "cors";

dotenv.config({});
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

// default middleware 
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// routes
app.use('/api/v1/user', userRoute);
app.use('api/v1/course', courseRoute);

app.get('/', (req, res) => {
    return res.json({message: "Hello World"});
})

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});


