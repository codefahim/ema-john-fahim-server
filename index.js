const express = require('express')
const app = express()
require('dotenv').config()
const port = 5000
const bodyParser = require('body-parser')
const cors = require('cors')


//the middleware for convert data 
app.use(bodyParser.json())
app.use(cors())

//db Connection from here

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xris.mongodb.net/emajonstore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allProducts = client.db("emajonstore").collection("products");
  const ordersCollection = client.db("emajonstore").collection("orders");
  // perform actions on the collection object
  console.log('db connected')
  //order post to server
  app.post('/orders',(req, res)=>{
    const orders=req.body;
    console.log(orders)
    ordersCollection.insertOne(orders)
    .then(result=>{
        
        res.send(result.insertedCount>0)
    
 })
})
  //data transfer to database
  app.post('/products',(req, res)=>{
      const product=req.body;
      console.log(product)
      allProducts.insertOne(product)
      .then(result=>{
        
             res.send(result.insertedCount>0)
         
      })
  })
   //data transfer to database
   //data find by keys
   app.post('/productsByKeys',(req, res)=>{
       const productsKeys = req.body;
       console.log(productsKeys)
       allProducts.find({key: {$in: productsKeys}})
       .toArray((err,documents)=>{
        res.send(documents)
    })
   })

    //data find by keys

    //create custom api
   app.get('/totalProduct', (req, res)=>{
    // allProducts.find({}).limit(20)
     const search = req.query.search;
     allProducts
       .find({ name: { $regex: search } })
       .toArray((err, documents) => {
         res.send(documents);
       });
   })

   //find Single item for product details page of client
   app.get('/totalProduct/:key', (req, res)=>{
    
    allProducts.find({key: req.params.key})
    .toArray((err,documents)=>{
        res.send(documents[0])
    })
   })
 
});



//db connection close here
app.get('/', (req, res) => {
  res.send('Hello World!This is fahim');
})
// console.log(process.env.DB_USER)
app.listen(process.env.PORT || port)
