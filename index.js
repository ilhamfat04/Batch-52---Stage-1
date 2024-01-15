const express = require('express')
const app = express()
const port = 5000

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

function home(req, res) {
    res.render('index')
}

function contact(req, res) {
    res.render('contact')
}

function blog(req, res) {

    res.render('blog', { data, title: "myblog" })
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

function handlePostBlog(req, res) {
    // const title = req.body.ujang
    // const content = req.body.content

    const { title, content, languages } = req.body

    data.push({ title, content })
    console.log(languages);

    res.redirect('/blog')
}

function handleDeleteBlog(req, res) {
    const { id } = req.params

    data.splice(id, 1)
    console.log("berhasil delete id", id);
    res.redirect('/blog')
}

function editBlog(req, res) {
    res.render("edit-blog")
}

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`)
})