const db=require("../db/queries")
const {getBlogsByUser}=require("../controllers/blogsController")
const {verifyToken}=require("../middleware/auth")
const express=require("express")
const router=express.Router()
router.get("/",verifyToken,getBlogsByUser)
module.exports=router