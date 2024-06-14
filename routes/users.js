const router=require("express").Router();
const User=require("../models/User");
const bcrypt=require("bcrypt");
const Post=require("../models/Post")

//update
router.put("/:id",async(req,res)=>{
        if(req.body.userId===req.params.id){  
            if(req.body.password){
                const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);
            }
    try{
            const updateUser=await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            },{new:true});
            res.status(200).json(updateUser);
    } catch(err){
        res.status(500).json(err);
    }
        }else {
            res.status(401).json("You can update only your account");
        }
});
// router.put("/:id", async (req, res) => {
//     console.log("Received request to update user:", req.body);

//     if (req.body.userId !== req.params.id) {
//         return res.status(401).json("You can update only your account");
//     }

//     if (req.body.password) {
//         try {
//             const salt = await bcrypt.genSalt(10);
//             req.body.password = await bcrypt.hash(req.body.password, salt);
//         } catch (err) {
//             console.error("Error hashing password:", err);
//             return res.status(500).json("Error hashing password");
//         }
//     }

//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             console.error("User not found:", req.params.id);
//             return res.status(404).json("User not found");
//         }

//         const updateUser = await User.findByIdAndUpdate(
//             req.params.id,
//             { $set: req.body },
//             { new: true }
//         );

//         console.log("User updated successfully:", updateUser);
//         res.status(200).json(updateUser);
//     } catch (err) {
//         console.error("Error updating user:", err);
//         res.status(500).json("Error updating user");
//     }
// });


//delete
router.delete("/:id",async(req,res)=>{
    if(req.body.userId===req.params.id){  
        try{ 
            const user=await User.findById(req.params.id);
    try{
        await Post.deleteMany({username:user.username})
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json("User has been deleted");
    } catch(err){
    res.status(500).json(err);
    }
    }catch(err){
        req.status(404).json("User not find");
    }   
    }else {
        res.status(401).json("You can delete only your account");
    }
})

//get User 
router.get("/:id", async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const {password , ...others}=user._doc
        res.status(200).json(others);
    }catch(err){
        res.status(500),json(err);
    }
})

module.exports=router;