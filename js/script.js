// Constants
async function fetchServerUrl() {
    try {
        const response = await fetch('config.json');
        const data = await response.json();
        return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}
const serverUrl = fetchServerUrl();
  

// Partials
fetch('partials/nav.html')
    .then(response => response.text())
    .then(data => {
        const navElement = document.getElementById('nav');
        navElement.innerHTML = data;
        const signupElement = document.getElementById('signupButton')
        const loginElement = document.getElementById('loginButton')
        signupElement.addEventListener('click', () => {
            let form = document.getElementsByClassName('form')
            if (form.length != 0) {
                form = form[0]
            }
            if (form.length != 0) {
                console.log(form.parentElement)
                form.parentElement.parentElement.parentElement.removeChild(form.parentElement.parentElement);
                return;
            }
            form = document.createElement('div');
            configSignup(form)
            document.body.appendChild(form);
        })
        loginElement.addEventListener('click', () => {
            let form = document.getElementsByClassName('form')
            if (form.length != 0) {
                form = form[0]
            }
            if (form.length != 0) {
                console.log(form.parentElement)
                form.parentElement.parentElement.parentElement.removeChild(form.parentElement.parentElement);
                return;
            }
            form = document.createElement('div');
            configLogin(form)
            document.body.appendChild(form);
        })
    })
    .catch(error => {console.error('Erro ao carregar o arquivo nav.html:', error)});

const loginElement = document.getElementById('login')

// Functions
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function configSignup(signupElement) {
    fetch('partials/signup.html')
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
                    serverUrl
                        .then(response => response.url)
                        .then(url => {
                            fetchAsync(`${url}signup`, {
                                name: name,
                                email: email,
                                encryptedPass: passwordSHA256
                            })
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

function configLogin(loginElement) {
    fetch('partials/login.html')
        .then(response => response.text())
        .then(data => {
            loginElement.innerHTML = data;
            loginElement.addEventListener("submit", function (event) {
                event.preventDefault();
                login = event.target[0].value;
                password = event.target[1].value;
            });
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo login.html:', error);
        });
}

async function fetchAsync (url, data) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'txext/plain'
        },
        body: JSON.stringify(data)
    });
    let responseText = await response.text();
    console.log(responseText)
    return responseText;
}

var login = ""
var password = ""