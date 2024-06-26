const express=require("express");
const app=express();
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const authRoute=require("./routes/auth")
const userRoute=require("./routes/users")
const postRoute=require("./routes/posts")
const categoryRoute=require("./routes/catogories")
const multer =require("multer")
const path=require("path");
const cors=require("cors");
const morgan=require("morgan");

app.use(cors({
    origin: 'https://project-tan-seven-19.vercel.app'
}));
dotenv.config();
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")));

mongoose.connect(process.env.MONGODB_URL , {
}).then(console.log("connected to mongodb")).catch((err)=>console.log(err));

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"images");
    },filename:(req,file,callback)=>{
        callback(null,req.body.name);
    }
});

const upload=multer({storage:storage});
app.post("/api/upload", upload.single("file"),(req,res)=>{
    res.status(200).json("File has been uploaded");
})
app.use(morgan("dev"));
app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories", categoryRoute);
app.listen("5000",()=>{
    console.log("Backened is running");
})
