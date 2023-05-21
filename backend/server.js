const http = require('http');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const dbName = 'mydb';
const data = fs.readFileSync('../../dbCredentials.json', 'utf8')
const dbCredentials = JSON.parse(data);
const dbUrl = `mongodb+srv://${dbCredentials.login}:${dbCredentials.pass}@cluster0.byet7nj.mongodb.net/`;
const client = new MongoClient(dbUrl);

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
    // pass the user's sha256 password through sha256 again on serverside
    data['encryptedPass'] = await sha256(data['encryptedPass'])
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
            const storedEncryptedPass = result['encryptedPass']
            encryptedPass = await sha256(encryptedPass)
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

// Get the url of forwarding from ngrok and store it so the clientside can use
fetch('http://127.0.0.1:4040/api/tunnels/first')
    .then(response => response.json())
    .then(data => {
        const ngrokURL = data.public_url;
        fs.writeFile('../js/config.json', `{\n    "port": 80,\n    "url": "${data.public_url}"\n}`, (error) => {
            if (error) {
                console.error('Error writing file:', error);
                return;
            }
            console.log('URL written on the clientside!');
        })
        console.log('ngrok URL:', ngrokURL);
    })
    .catch(error => console.error('Error retrieving ngrok URL:', error));
