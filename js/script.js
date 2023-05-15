// Constants
const serverUrl = 'http://127.0.0.1:3000/'

// Partials
fetch('../partials/nav.html')
    .then(response => response.text())
    .then(data => {
        const navElement = document.getElementById('nav');
        navElement.innerHTML = data;
    })
    .catch(error => {console.error('Erro ao carregar o arquivo nav.html:', error)});

const signupElement = document.getElementById('signup');
const loginElement = document.getElementById("login")

if (signupElement) {
    fetch('../partials/signup.html')
        .then(response => response.text())
        .then(data => {
            signupElement.innerHTML = data;
            signupElement.addEventListener("submit", function (event) {
                event.preventDefault();

                var name = document.getElementById("name").value;
                var email = document.getElementById("email").value;
                var password = document.getElementById("password").value;
                
                const hash = sha256(password)
                function storeData(passwordSHA256) {
                    console.log("Name: " + name);
                    console.log("Email: " + email);
                    console.log("password SHA256: " + passwordSHA256);
                    fetchAsync(serverUrl, {
                        name: name,
                        email: email,
                        encryptedPass: passwordSHA256
                    })
                }
                hash.then(storeData)
                    .catch(error => { console.error('Erro ao gerar SHA256 da senha:', error) })
            });
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo signup.html:', error);
        });
}

// Functions
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function fetchAsync (url, data) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let responseText = await response.text();
    return responseText;
}