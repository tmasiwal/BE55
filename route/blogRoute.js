
const express=require('express')

const {auth}=require("../middleware/auth")
const {BlogModel}= require("../model/blogModel")
const {UserModel}=require("../model/userModel")
const {CommentModel} =require("../model/comments")
const blogRoute=express.Router();

blogRoute.get("/",auth,async(req,res)=>{
    let q= {}
let blog;
    if(req.query.title){
        q.title=req.query.title
    }
    if(req.query.category){
        q.category=req.query.category
    }
    if(req.query.sort){
      if(req.query.sort=="asc"){
        blog = await  BlogModel.find(q).sort({dates:-1}).exec()
      }
      else{
        blog = await  BlogModel.find(q).sort({dates:1}).exec()
      }
    }
 else{  blog= await BlogModel.find(q).exec()}
  if(blog){
    res.status(200).send(blog)
  }
  else {
    res.send({"msg":"blog is not found"})
  }
})

blogRoute.post("/",auth,async(req,res)=>{

    const today =new Date();
    const year =today.getFullYear();
    const month= String(today.getMonth()+1).padStart(2,'0');
    const day=String(today.getDate()).padStart(2,'0');
    const formattedDate= `${year}-${month}-${day}`
     req.body.date=formattedDate
     req.body.dates=today;
    //  console.log(req.body)
     const blog= new BlogModel(req.body)
     await blog.save();

     res.send({"msg":"success added blog"})
})

blogRoute.patch('/:id/like',auth,async(req,res)=>{
    const {id}=req.params
    const blog = await BlogModel.findOne({_id:id})
    console.log(blog)
    blog.likes=blog.likes+1

    await BlogModel.findByIdAndUpdate(id,blog)
    res.send({"msg":"success updated blog",data:blog})
})

blogRoute.patch('/:id/comments',auth,async(req,res)=>{

    const {id}=req.params
    const blog = await BlogModel.findOne({_id:id})
   
    req.body.blogId=id
const user= await UserModel.findOne({_id:blog.userID})
req.body.image=user.image
// console.log(user)
    // console.log(req.body)
    const comments= new CommentModel(req.body);
    await comments.save();
    console.log(req.body)
blog.comments=[...blog.comments,req.body]

await BlogModel.findByIdAndUpdate(id,blog)
res.send({"msg":"comment is added successfully"})

})

blogRoute.delete("/:id",auth,async(req,res)=>{
  const {id}=req.params
  const blog = await BlogModel.findOne({_id:id})
  try{
if(req.body.userID!=blog.userID){
  res.send({"msg":" you are not allowed to delete this"})
}
else {

  await BlogModel.findByIdAndDelete(id)

res.send({"msg":" blog is deleted successfully"})}

  }
  catch(err){

    res.send({"msg":err.message})
  }

})



blogRoute.patch('/:id',auth,async(req,res)=>{
  const {id}=req.params
  const blog = await BlogModel.findOne({_id:id})
  try{
if(req.body.userID!=blog.userID){
  res.send({"msg":" you are not allowed to delete this"})
}
else {

  await BlogModel.findByIdAndUpdate(id,req.body)

res.send({"msg":" blog is deleted successfully"})}

  }
  catch(err){

    res.send({"msg":err.message})
  }
})
module.exports={blogRoute}