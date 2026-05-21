// db/queries.js
const prisma = require('./prisma')

// ── REQUIRED FOR AUTH - do not remove ─────────────────

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  })
}

async function createUser(data) {
  return await prisma.user.create({ data })
}

// ── ADD YOUR PROJECT QUERIES BELOW ────────────────────

async function getAllPublishedBlogs(){
  return await prisma.blog.findMany({
    where:{isPublished:true},
    include:{
      author:{select:{firstName:true,lastName:true}},
      _count:{select:{comments:true}}
    },
    orderBy:{createdAt:"desc"}
  })
}

async function getBlogsByUserId(authorId){
  return await prisma.blog.findMany({
    where:{authorId},
    include:{
      _count:{select:{comments:true}}
    }
  })
}

async function getBlogDetail(id){
  return await prisma.blog.findUnique({
    where:{id},
    include:{
      author:{select:{firstName:true,lastName:true}},
      comments:{
        orderBy:{createdAt:"desc"},
        select:{
          id:true,
          text:true,
          createdAt:true,
          authorId:true,
          author:{select:{firstName:true,lastName:true}}
        }
      },
      _count:{select:{comments:true}}
    }
  })
}

async function createBlog(data){
  return await prisma.blog.create({
    data
  })
}

async function editBlog(id,data){
  return await prisma.blog.update({
    where:{id},
    data
  })
}

async function deleteBlog(id){
  return await prisma.blog.delete({
    where:{id}
  })
}

async function togglePublishBlog(id){
  const blog=await prisma.blog.findUnique({where:{id}})
  return await prisma.blog.update({
    where:{id},
    data:{isPublished:!blog.isPublished}
  })
}

async function createComment(data){
  return await prisma.comment.create({data})
}

async function editComment(id,data){
  return await prisma.comment.update({
    where:{id},data
  })
}

async function deleteComment(id){
  return await prisma.comment.delete({where:{id}})
}

async function getBlogById(id){
  return await prisma.blog.findUnique({
    where:{id}
  })
}

async function getCommentById(id){
  return await prisma.comment.findUnique({
    where:{id},
    include:{blog:{select:{authorId:true}}}
  })
}

async function getCommentsByBlogId(blogId){
  return await prisma.comment.findMany({
    where:{blogId},
    select:{blog:{select:{authorId:true}}}
  })
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  getAllPublishedBlogs,
  getBlogsByUserId,
  getBlogDetail,
  getBlogById,
  createBlog,
  editBlog,
  deleteBlog,
  togglePublishBlog,
  createComment,
  deleteComment,
  editComment,
  getCommentById,
  getCommentsByBlogId
}