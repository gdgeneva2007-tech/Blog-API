const express=require("express")
const router=express.Router()
const { verifyToken, optionalToken ,
  verifyBlogAuthor,verifyCommentAuthor
}=require("../middleware/auth")
const {
    blogValidateRules,
    getAllPublishedBlogs,
    getBlogDetail,
    getBlogsByUser,
    createBlog,
    loadBlog,
    editBlog,
    deleteBlog,
    togglePublishBlog,
}=require("../controllers/blogsController")
const {
    commentValidateRules,
    createComment,
    getCommentsByBlogId,
    loadComment,
    deleteComment,
    editComment,
    getCommentById,
}=require("../controllers/commentsController")

router.get("/",getAllPublishedBlogs)
router.post("/",verifyToken,blogValidateRules,createBlog)
router.get("/:blogId",optionalToken,getBlogDetail)
router.put("/:blogId",verifyToken,loadBlog,verifyBlogAuthor,blogValidateRules,editBlog)
router.delete("/:blogId",verifyToken,loadBlog,verifyBlogAuthor,deleteBlog)
router.patch("/:blogId/toggle-publish",verifyToken,loadBlog,verifyBlogAuthor,togglePublishBlog)

router.get("/:blogId/comments",getCommentsByBlogId)
router.post("/:blogId/comments",verifyToken,commentValidateRules,createComment)
router.get("/:blogId/comments/:commentId",verifyToken,getCommentById)
router.put("/:blogId/comments/:commentId",verifyToken,loadComment,verifyCommentAuthor,commentValidateRules,editComment)
router.delete("/:blogId/comments/:commentId",verifyToken,loadComment,deleteComment)

module.exports=router