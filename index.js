const express = require('express')
const app = express()
const port = 5000

// use handlebars for template engine
app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/assets', express.static('src/assets'))

app.get('/', home)
app.get('/contact', contact)
app.get('/blog', blog)
app.get('/blog-detail/:id', blogDetail)


function home(req, res) {
    res.render('index')
}

function contact(req, res) {
    res.render('contact')
}

function blog(req, res) {
    const data = [
        {
            id: 1,
            title: "Data 1",
            content: "Content 1"
        },
        {
            id: 2,
            title: "Data 2",
            content: "Content 2"
        },
        {
            id: 3,
            title: "Data 3",
            content: "Content 3"
        }
    ]
    res.render('blog', { data })
}

function blogDetail(req, res) {
    const { id } = req.params

    res.render('blog-detail', { id })
}

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`)
})