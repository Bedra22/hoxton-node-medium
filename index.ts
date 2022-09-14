import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"

const port = 5000
const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient({ log: ['warn', 'error', 'info', 'query'] })

app.get('/posts', async (req, res) => {
    const getPosts = await prisma.posts.findMany({ include: { comment: true } })
    res.send(getPosts)
})

app.get('/posts/:id', async (req, res) => {
    const id = Number(req.params.id)
    const getPostsById = await prisma.posts.findUnique({ where: { id }, include: { comment: true } })
    res.send(getPostsById)
})

app.post('/posts', async (req, res) => {
    const getNewPost = await prisma.posts.create({ data: req.body, include: { comment: true } })
    res.send(getNewPost)
})


app.listen(port, () => {
    console.log(`We are running on http://localhost:${port}`)
})