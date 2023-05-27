const express = require('express');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const data = fs.readFileSync('config.json', 'utf8')
const config = JSON.parse(data);

const hostname = config.hostname;
const port = config.port;

const dbName = 'mydb';
const dbUrl = `mongodb+srv://${config.dbLogin}:${config.dbPass}@cluster0.byet7nj.mongodb.net/`;
const client = new MongoClient(dbUrl);
console.log(dbName)
console.log(dbUrl)

const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.post('/signup', (req,res) => {
    req.on('data', chunk => {
        const data = chunk.toString()
        console.log(data)
        newUser(JSON.parse(data))
    })
    .on('end', function(){
        return res
    });
})

app.get('/',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res
})

app.listen(port, () => {console.log(`server listening at port ${port}`);})


async function newUser(data) {
    console.log(data)
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('accounts');
    // pass the user's sha256 password through sha256 again on serverside
    const result = await collection.insertOne(data)
    return result
}

async function validateLogin(login, encryptedPass) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('accounts');
        const result = await collection.findOne(login)
        if (result) {
            if (result['encryptedPass']==encryptedPass) return true
            else throw new Error('Login and password do not match. Please check your username and try again.')
        } else {
            throw new Error('Login does not exist. Please check your username and try again.')
        }
    } catch (error) {
        console.error("Error logging in: ", error.message)
    }
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}