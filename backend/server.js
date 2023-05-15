const http = require('http');
const { MongoClient } = require('mongodb');

const hostname = '127.0.0.1';
const port = 3000;

const dbUrl = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(dbUrl);
const dbName = 'mydb';


const server = http.createServer((request, response) => {
    request.on('data', (chunk) => {
        const data = chunk.toString();
        newUser(dbUrl, JSON.parse(data))
            .then(console.log)
            .catch(console.error)
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

async function newUser(url, data) {
    console.log(data)
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('accounts');
    const result = await collection.insertOne(data)
}

