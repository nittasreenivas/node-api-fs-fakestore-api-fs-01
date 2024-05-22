const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
var bodyParser = require('body-parser')
const fs = require('fs')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.options('*',cors())

app.get('/',(req,res) => {
    res.send(`welcome to home page`)
})

app.get('/products',(req,res) => {
    let products = JSON.parse(fs.readFileSync('products.json').toString())
    let allProducts = products.map((p) => {
        return {
            id:p.id,
            title:p.title,
            price:p.price,
            description:p.description,
            category:p.category,
            image:p.image,
            'rating.rate':p.rating.rate,
            'rating.count':p.rating.count

        }
    })
    res.send(allProducts)
})

app.get('/products/:id',(req,res) => {
    let products = JSON.parse(fs.readFileSync('products.json').toString())
    let singleProd = products.filter((p) => {
        return p.id == req.params.id
    }) 
    if(singleProd.length === 0){
        res.send(`${req.params.id} id not found`)
    }else{
        res.send(singleProd)
    }
})

app.post('/products',(req,res) => {
    let products = JSON.parse(fs.readFileSync('products.json').toString())

    const {id,title,price,description,category,image,rating} = req.body;

    if(!title){
        res.send(`pls provide a valid title`)
    }
    if(!price){
        res.send(`pls provide a valid price`)
    }
    if(!description){
        res.send(`pls provide a valid description`)
    }
    if(!category){
        res.send(`pls provide a valid category`)
    }
    if(!image){
        res.send(`pls provide a valid image`)
    }
    if(!rating){
        res.send(`pls provide a valid rating`)
    }
    if(!rating.rate === undefined){
        res.send(`pls providea valid rating.rate`)
    }
    if(!rating.count === undefined){
        res.send(`pls providea valid rating.count`)
    }
    let newProd = {
        id:products.length + 1,
        title:title,
        price:price,
        description:description,
        category:category,
        image:image,
        rating:{
            'rating.rate':rating.rate,
            'rating.count':rating.count
        }
    }
    products.push(newProd)
    fs.writeFile('products.json',JSON.stringify(products,null,2),function(err){
        if(err){
            console.log(err.message)
        }else{
            res.send(newProd)
        }
    })
})

app.put('/products/:id', (req, res) => {
    let products = JSON.parse(fs.readFileSync('products.json').toString());
    const { title, price, description, category, image, rating } = req.body;

    let productIndex = products.findIndex((p) => p.id == req.params.id);
    if (productIndex === -1) {
        res.status(404).send(`${req.params.id} id not found`);
        return;
    }

    let product = products[productIndex];

    if (title) {
        product.title = title;
    }
    if (price) {
        product.price = price;
    }
    if (description) {
        product.description = description;
    }
    if (category) {
        product.category = category;
    }
    if (image) {
        product.image = image;
    }
    if (rating) {
        if (rating.rate !== undefined) {
            product.rating.rate = rating.rate;
        }
        if (rating.count !== undefined) {
            product.rating.count = rating.count;
        }
    }

    fs.writeFile('products.json', JSON.stringify(products, null, 2), function (err) {
        if (err) {
            console.log(err.message);
            res.status(500).send('Error updating product');
        } else {
            res.send(product);
        }
    });
});

app.delete('/products/:id',(req,res) => {
    let products = JSON.parse(fs.readFileSync('products.json').toString()); 
    let productIndex = products.findIndex((p) => p.id == req.params.id);
    if (productIndex === -1) {
        res.status(404).send(`${req.params.id} id not found`);
    }
    products.splice(productIndex, 1);
    fs.writeFile('products.json',JSON.stringify(products,null,2),function(err){
        if(err){
            console.log(err.message)
        }else{
            res.send(products)
        }
    })
})
const port = 3500

app.listen(port,() => {
    console.log(`server is running on port ${port}`)
})