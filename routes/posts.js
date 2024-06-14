const router=require("express").Router();
const User=require("../models/User");
const Post=require("../models/Post")

//add newpost
router.post("/",async(req,res)=>{
    const newPost=new Post(req.body);
    try{
        const savedPost=await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);  
    }
})

//update the post
router.put("/:id",async(req,res)=>{
    try{
         const post=await Post.findById(req.params.id);
         if(post.username===req.body.username){
            try{
                  const updatedPost= await Post.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                  },{
                    new:true
                  });
                  res.status(200).json(updatedPost);
            }catch(err){
                res.status(500).json(err);
            }         
            
         }else res.status(401).json("you can update only your post");
           

    }catch(err){
        res.status(500).json(err);
    }
})

//delete the post
// router.delete("/:id",async(req,res)=>{
//     try{
//         const post=await Post.findById(req.params.id);
//         if (!post) {
//             return res.status(404).json("Post not found");
//         }
//         if(post.username===req.body.username){
//             try{
//                 await post.delete();
//                 res.status(200).json("Post has been deleted");
//             }catch(err){
//                return res.status(500).json(err);
//             }
//         }else res.status(401).json("you can delete only your post");
//     }catch(err){
//         res.status(500).json(err);
//     }
// });
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json("Post not found");
        }

        if (post.username === req.body.username) {
            try {
                await post.deleteOne();
                return res.status(200).json("Post has been deleted");
            } catch (err) {
                console.error("Error deleting post: ", err);
                return res.status(500).json("An error occurred while deleting the post");
            }
        } else {
            return res.status(401).json("You can delete only your post");
        }
    } catch (err) {
        console.error("Error finding post: ", err);
        return res.status(500).json("An error occurred while retrieving the post");
    }
});

//get post
router.get("/:id",async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        res.status(200).json(post);

    } catch(err){
        res.status(500).json(err);
    }
})
//get all posts
router.get("/",async(req,res)=>{
    const username=req.query.user;
    const category=req.query.cat;
    try{
        let posts;
        if(username){
            posts=await Post.find({username})
        }else if(category){
            posts=await Post.find({categories:{
                    $in:[category]
            }})
        }else {
            posts=await Post.find();
        }
        res.status(200).json(posts);
    } catch(err){
        res.status(500).json(err);
    }
})

module.exports=router;