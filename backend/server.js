const http = require('http');
const crypto = require('crypto')
const { MongoClient } = require('mongodb');

const hostname = '127.0.0.1';
const port = 3000;

const dbUrl = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(dbUrl);
const dbName = 'mydb';


const server = http.createServer((request, response) => {
    request.on('data', (chunk) => {
        const data = chunk.toString();
        newUser(JSON.parse(data))
            .then(result => console.log(result))
            .catch(error => console.error(error))
            .finally(() => client.close());
    }).on('end', () => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.end("");
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function newUser(data) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('accounts');
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
            console.log(result['encryptedPass'])
            console.log(encryptedPass)
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