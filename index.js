const express = require('express')
const dbPool = require('./src/connection/index')
const bcrypt = require('bcrypt');
const session = require('express-session')
const flash = require('express-flash')
const app = express()
const port = 5000

// sequelize config
const { development } = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require('sequelize')
const SequelizePool = new Sequelize(development)

// use handlebars for template engine
app.set('view engine', 'hbs')
app.set('views', 'src/views')

app.use('/assets', express.static('src/assets'))
app.use(express.urlencoded({ extended: false })) // body parser

// middleware session
app.use(session({
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 2 * 60 * 60 * 1000
    },
    resave: false,
    store: session.MemoryStore(),
    secret: 'session_storage',
    saveUninitialized: true
}))
app.use(flash())

app.get('/', home)
app.get('/contact', contact)
app.get('/blog', blog)
app.get('/blog-detail/:id', blogDetail)
app.get('/add-blog', addBlog)
app.post('/blog', handlePostBlog)
app.get('/delete/:id', handleDeleteBlog)
app.get('/edit-blog/:id', editBlog)
app.get('/register', formRegister)
app.post('/register', addRegister)
app.get('/login', formLogin)
app.post('/login', isLogin)

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

function home(req, res) {
    res.render('index', {
        isLogin: req.session.isLogin,
        user: req.session.user
    })
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

        res.render('blog', { 
            data,
            isLogin: req.session.isLogin,
            user: req.session.user
        })
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

function formRegister(req, res) {
    res.render('register')
}

async function addRegister(req, res) {
    try {
        const { name, email, password } = req.body
        const salt = 10

        bcrypt.hash(password, salt, async (err, hashPasword) => {
            await SequelizePool.query(`INSERT INTO users (name, email, password, "createdAt", "updatedAt") VALUES ('${name}','${email}','${hashPasword}', NOW(), NOW())`)
        })
        res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
}

function formLogin(req, res) {
    res.render('login')
}

async function isLogin(req, res) {
    try {
        const { email, password } = req.body

        const checkEmail = await SequelizePool.query(`SELECT * FROM users WHERE email = '${email}'`, { type: QueryTypes.SELECT })

        if(!checkEmail.length) {
            req.flash('failed', 'Email is not register');
            return res.redirect('/login')
        }

        bcrypt.compare(password, checkEmail[0].password, function(err, result) {
            if(!result) {
                return res.redirect("/login")
            } else {
                req.session.isLogin = true
                req.session.user = checkEmail[0].name
                req.flash('success', 'Welcome bwangggggg !!!!');
                return res.redirect('/')
            }
        });
    } catch (error) {
        console.log(error);
    }
}

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`)
})