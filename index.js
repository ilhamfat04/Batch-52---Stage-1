const express = require('express')
const dbPool = require('./src/connection/index')
const app = express()
const port = 5000

// sequelize config
const { development } = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require('sequelize')
const SequelizePool = new Sequelize(development)
let models = require("./src/models")
let Blog = models.Blog

// use handlebars for template engine
app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/assets', express.static('src/assets'))
app.use(express.urlencoded({ extended: false })) // body parser

app.get('/', home)
app.get('/contact', contact)
app.get('/blog', blog)
app.get('/blog-detail/:id', blogDetail)
app.get('/add-blog', addBlog)
app.post('/blog', handlePostBlog)
app.get('/delete/:id', handleDeleteBlog)
app.get('/edit-blog/:id', editBlog)

const data = []

// function home(req, res) {
//     res.render('index')
// }

// function home(req, res) {
//     dbPool.connect((err, client, done) => {
//         if(err) throw err

//         client.query("SELECT * FROM tb_users", (err, result) => {
//             done()
//             if(err) throw err

//             res.status(200).json(result)
//         })
//     })
// }

async function home(req, res) {
    try {
        const query = await SequelizePool.query("SELECT * FROM users", { type: QueryTypes.SELECT })
        console.log(query)
        res.render('index')
    } catch (error) {
        throw error
    }
}

function contact(req, res) {
    res.render('contact')
}

async function blog(req, res) {
    try {
        const query = await SequelizePool.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
        const data = query.map(res => ({
            ...res,
            author: "Megawati",
            image: "https://img.freepik.com/free-photo/modern-office-space-with-desktops-with-modern-computers-created-with-generative-ai-technology_185193-110089.jpg?w=826&t=st=1705553908~exp=1705554508~hmac=e65ecda5f1b0cc049b17c786b0674845bdd02f9ac3dcda91ed3ae13847e2c389"
        }))

        res.render('blog', { data })
    } catch (error) {
        throw error
    }
}

function blogDetail(req, res) {
    const { id } = req.params

    const dataDetail = data[id]

    res.render('blog-detail', { data: dataDetail })
}

function addBlog(req, res) {
    const addBlogTitle = "Add Blog"
    res.render("add-blog", { data: addBlogTitle })
}

async function handlePostBlog(req, res) {
    try {
        const { title, content } = req.body
        const query = await SequelizePool.query(`INSERT INTO blogs(title, content, "createdAt", "updatedAt") VALUES ('${title}','${content}', NOW(), NOW())`)

        res.redirect('/blog')
    } catch (error) {
        throw error
    }
}

async function handleDeleteBlog(req, res) {
    try {
        const { id } = req.params
        await SequelizePool.query(`DELETE FROM blogs WHERE id = ${id}`)

        res.redirect('/blog')
    } catch (error) {
        throw error
    }
}

function editBlog(req, res) {
    res.render("edit-blog")
}

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`)
})