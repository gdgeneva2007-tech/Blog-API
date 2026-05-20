const { blog } = require("../db/prisma")
const db=require("../db/queries")
const {body,validationResult}=require("express-validator")
const blogValidateRules=[
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("text").trim().notEmpty().withMessage("Text is required.")
]

const getAllPublishedBlogs=async (req ,res ,next)=>{
    try{
        const blogs=await db.getAllPublishedBlogs()
        res.json({blogs})
    }catch(err){
        next(err)
    }
}

const getBlogsByUser=async (req,res,next)=>{
    try{
        const blogs=await db.getBlogsByUserId(req.user.id)
        res.json({blogs})
    }catch(err){
        next(err)
    }
}

const getBlogDetail=async (req,res,next)=>{
    try{
        const blogId=Number(req.params.blogId)
        if(isNaN(blogId)){
            return res.status(404).json({message:"Blog not found."})
        }
        const blog=await db.getBlogDetail(blogId)
        if(!blog||(!blog.isPublished && blog.authorId!==req.user?.id))return res.status(404).json({message:"Blog not found."})
        return res.json({blog})
    }catch(err){
        next(err)
    }
}

const createBlog=async (req,res,next)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const blog=await db.createBlog({
            title:req.body.title,
            text:req.body.text,
            authorId:req.user.id
        })
        res.status(201).json({message:"Blog created.",blog})
    }catch(err){
        next(err)
    }
}

// middleware to load blog before PUT and DELETE
const loadBlog=async (req,res,next)=>{
    try{
        const id=Number(req.params.blogId)
        if(isNaN(id))return res.status(404).json({message:"Blog not found."})
        const blog=await db.getBlogById(id)
        if(!blog)return res.status(404).json({message:"Blog not found."})
        req.blog=blog
        next()
    }catch(err){
        next(err)
    }
}

const editBlog=async (req,res,next)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const blog=await db.editBlog(req.blog.id,{
            title:req.body.title,
            text:req.body.text
        })
        res.json({message:"Blog updated.",blog})
    }catch(err){
        next(err)
    }
}

const deleteBlog=async (req,res,next)=>{
    try{
        await db.deleteBlog(req.blog.id)
        res.json({message:"Blog deleted."})
    }catch(err){
        next(err)
    }
}

const togglePublishBlog=async (req,res,next)=>{
    try{
        const blog=await db.togglePublishBlog(req.blog.id)
        res.json({message:"Published state toggled!",blog})
    }catch(err){
        next(err)
    }
}

module.exports={
    blogValidateRules,
    getAllPublishedBlogs,
    getBlogDetail,
    getBlogsByUser,
    createBlog,
    loadBlog,
    editBlog,
    deleteBlog,
    togglePublishBlog,
}