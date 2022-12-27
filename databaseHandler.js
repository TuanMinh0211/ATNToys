var mongoClient = require('mongodb').MongoClient
// var url = 'mongodb://0.0.0.0:27017'
var url = 'mongodb+srv://tminh12:tminh12@cluster0.1ulxypv.mongodb.net/test'
const { Int32, ObjectId } = require('bson')

async function insertProduct(newProduct) {
    let client = await mongoClient.connect(url) //await: doi ham trien khai, bat buoc phai co async
    let db = client.db("ATNToys")
    let id = await db.collection("products").insertOne(newProduct)
    return id
}

async function searchProductbyName(name) {
    console.log(name)
    
    let client = await mongoClient.connect(url)
    let db = client.db("ATNToys")
    const result = await db.collection("products").find({name: new RegExp(name, 'i')}).toArray()
    console.log(result)
    return result
}

async function getAllProduct() {
    let client = await mongoClient.connect(url) //await: doi ham trien khai, bat buoc phai co async
    let db = client.db("ATNToys")
    let results = await db.collection("products").find().toArray()
    return results
}

async function deleteProductbyId(id) {
    let client = await mongoClient.connect(url) //await: doi ham trien khai, bat buoc phai co async
    let db = client.db("ATNToys")
    await db.collection("products").deleteOne({ _id: ObjectId(id) })
}

async function findProductbyId(id) {
    let client = await mongoClient.connect(url)
    let db = client.db("ATNToys")
    let pr = await db.collection("products").findOne({ _id: ObjectId(id) }) //await su dung de 
    return pr
}

async function updateProduct(id, product) {
    let client = await mongoClient.connect(url)
    let db = client.db("ATNToys")
    await db.collection("products").updateOne({ _id: ObjectId(id) }, { $set: product })
}
module.exports = {insertProduct, getAllProduct, deleteProductbyId, findProductbyId, updateProduct, searchProductbyName}//co the su dung ham insert cho cac file khac