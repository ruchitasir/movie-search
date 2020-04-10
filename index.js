require('dotenv').config()

let fetch = require('node-fetch')
// Require needed modules
let express = require('express')

// Declare a new Express app
let app = express()
// Set the template language to EJS
app.set('view engine', 'ejs')
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
        res.render('results',{results: data.Search, query:req.query.query, page:parseInt(page)})
    })
    .catch(err=>{
        console.log('An error',err)
        res.send('An error')
    })
    //res.send('we got here')
})
// Pick a port for it to listen on
app.listen(3000, () => {
    console.log('Ready to rock and roll! 🎸')
})