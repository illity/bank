# bank
This project aims to simulate the applications of a bank. The aim is to train my web development skills.

# in order to config the server
install ngrok and place "ngrok.yaml" file in "%HOMEPATH%\AppData\Local\ngrok\ngrok.yml" with the following

authtoken: AUTHTOKEN
tunnels:
    first:
        addr: 3000
        proto: http
    second:
        addr: 8080
        proto: http
version: "2"
region: us

start ngrok
>>>ngrok start --all