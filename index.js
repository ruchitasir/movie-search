require('dotenv').config()

let fetch = require('node-fetch')
// Require needed modules
let express = require('express')
let db = require('./models')

// Declare a new Express app
let app = express()
// Set the template language to EJS
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
// Declare routes
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/search',(req,res)=>{
    console.log(req.query.query,process.env.OMDB_API_KEY)
    let page = req.query.page || 1
    let url = `http://www.omdbapi.com/?s=${req.query.query}&apikey=${process.env.OMDB_API_KEY}&page=${page}`
    console.log(url)
    fetch(url)
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
      //  res.render('results')
        res.render('results',{results: data.Search || [] , 
            query:req.query.query, 
            page:parseInt(page) || 0
        })
    })
    .catch(err=>{
        console.log('An error',err)
        res.send('An error')
    })
})
app.get('/faves',(req,res)=>{
    db.movie.findAll()
    .then(movies=>{
        res.render('faves',{movies})
    })
    .catch(err=>{
        console.log('Error',err)
        res.send('Uh Oh')
    })
    
})

app.post('/faves',(req,res)=>{
     db.movie.create(req.body)
     .then(newMovie=>{
         console.log('success')
         res.redirect('/faves')
     })
     .catch(err=>{
         console.log('Error',err)
         res.send('Error - check logs!')

     })
})
// Pick a port for it to listen on
app.listen(3000, () => {
    console.log('Ready to rock and roll! 🎸')
})