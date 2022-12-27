const { Int32, ObjectId } = require('bson')
var express = require('express')
const {insertProduct, getAllProduct, deleteProductbyId, findProductbyId, updateProduct, searchProductbyName} = require('./databaseHandler')
var app = express()
const crypto = require('crypto')
// var mongoClient = require('mongodb').MongoClient
// var url = 'mongodb://0.0.0.0:27017'
const {handlebars} = require('hbs')
app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))



handlebars.registerHelper('check', function(price){
    if(price > 20 )
        return true
    else
        return false    
})

//xem toan bo san pham
app.get('/all',async (req,res)=>{
    let results = await getAllProduct()
    res.render('allProduct', {results:results})
})

//tim kiem san pham
app.post('/search', async(req,res)=>{
    const search = req.body.search
    const result = await searchProductbyName(search)
    res.render('allProduct', {'results': result})
})

//chuc nang sap xep san pham theo gia
// app.post('/sort', async(req,res)=>{
//     let client = await mongoClient.connect(url)
//     const price = req.body.txtPrice
//     let db = client.db("GCH1002")
//     price.sort();
    
//     // let results = await db.collection("products").find().toArray()
//     res.render('allProduct', {'results': results})
//     console.log(results)
// })

//update san pham
app.post('/update', async (req,res)=>{
    // const name = req.body.txtName
    // const price = req.body.txtPrice
    // const picURL= req.body.txtPic
    let id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL= req.body.txtPic
    const color = req.body.txtColor
    const product = {
        'name': name,
        'price': Number.parseFloat(price),
        'picture': picURL,
        'color': color
    }    
    await updateProduct(id, product)
    res.redirect('/all')
})

app.get('/edit', async(req,res)=>{
    let id = req.query.id
    let pr = await findProductbyId(id)//await su dung de 
    res.render('edit', {'pr':pr})
})


//xoa san pham
app.get('/delete', async(req,res)=>{
    const id = req.query.id
    console.log(id)
    await deleteProductbyId(id)
    res.redirect('/all')
})

// ----submit form----
app.post('/new', async(req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL= req.body.txtPic
    const color = req.body.txtColor
    if(name.trim().length==0){
        res.render("newProduct", {'error': 'Enter name!'})
        return;
    }
    const newProduct ={//paramester
        name: name,
        price: Number.parseFloat(price), //chuyen du lieu sang kieu so
        picture: picURL,
        color: color            
    }
    
    let id = await insertProduct(newProduct)
    console.log(id)
    res.render('home')
})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})

app.get('/',(req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 5500
app.listen(PORT)
console.log('Server is running at: ', PORT, '!')

// async function updateProduct(id, product) {
//     let client = await mongoClient.connect(url)
//     let db = client.db("GCH1002")
//     await db.collection("products").updateOne({ _id: ObjectId(id) }, { $set: product })
// }
// async function findProductbyId(id) {
//     let client = await mongoClient.connect(url)
//     let db = client.db("GCH1002")
//     let pr = await db.collection("products").findOne({ _id: ObjectId(id) }) //await su dung de 
//     return pr
// }
// async function deleteProductbyId(id) {
//     let client = await mongoClient.connect(url) //await: doi ham trien khai, bat buoc phai co async
//     let db = client.db("GCH1002")
//     await db.collection("products").deleteOne({ _id: ObjectId(id) })
// }
// async function getAllProduct() {
//     let client = await mongoClient.connect(url) //await: doi ham trien khai, bat buoc phai co async
//     let db = client.db("GCH1002")
//     let results = await db.collection("products").find().toArray()
//     return results
// }
// async function insertProduct(newProduct) {
//     let client = await mongoClient.connect(url) //await: doi ham trien khai, bat buoc phai co async
//     let db = client.db("GCH1002")
//     let id = await db.collection("products").insertOne(newProduct)
//     return id
// }