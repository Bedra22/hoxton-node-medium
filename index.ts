import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

const port = 5000
const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({ log: ['warn', 'error', 'info', 'query'] })

app.get('/posts', async (req, res) => {
    const getPosts = await prisma.posts.findMany({ include: { Users: true, comment: true } })
    res.send(getPosts)
})

app.get('/posts/:id', async (req, res) => {
    const id = Number(req.params.id)
    const getPostsById = await prisma.posts.findUnique({ where: { id }, include: { Users: true, comment: true } })
    if (getPostsById) {
        res.send(getPostsById)
    } else {
        res.status(404).send({ error: "User not found, try again please" })
    }
})

app.post('/posts', async (req, res) => {
    const posting = {
        imageContent: req.body.imageContent,
        writenContent: req.body.writenContent,
        usersId: req.body.usersId,
        likesInTotal: req.body.likesInTotal
    }
    let errors: string[] = []
    if (typeof req.body.imageContent !== 'string') {
        errors.push("ImageContent is not a string or not found")
    }
    if (typeof req.body.writenContent !== 'string') {
        errors.push("WritenContent is not a string or not found")
    }
    if (typeof req.body.usersId !== 'number') {
        errors.push("UsersId is not a number or not found")
    }
    if (typeof req.body.likesInTotal !== 'number') {
        errors.push("likesInTotal is not a number or not found")
    }
    if (errors.length === 0) {
        const getNewPost = await prisma.posts.create({
            data: {
                imageContent: posting.imageContent,
                writenContent: posting.writenContent,
                usersId: posting.usersId,
                likesInTotal: posting.likesInTotal
            },
            include: { comment: true }
        })
        res.send(getNewPost)
    } else {
        res.status(400).send(errors)
    }
})

app.get('/comments', async (req, res) => {
    const getComments = await prisma.comments.findMany({ include: { Posts: true } })
    res.send(getComments)
})

app.post('/comments', async (req, res) => {
    const addingCommentsOnPosts = {
        content: req.body.content,
        postsId: req.body.postsId
    }
    let errors: string[] = []
    if (typeof req.body.content !== "string") {
        errors.push("Content is not a string or not found")
    }
    if (typeof req.body.postsId !== "number") {
        errors.push("PostsId is not a number or not found")
    }
    if (errors.length === 0) {
        const addComment = await prisma.comments.create({
            data: {
                content: addingCommentsOnPosts.content,
                postsId: addingCommentsOnPosts.postsId
            },
            include: { Posts: true }
        })
        res.send(addComment)
    } else {
        res.status(400).send(errors)
    }
})


app.listen(port, () => {
    console.log(`We are running on http://localhost:${port}`)
})