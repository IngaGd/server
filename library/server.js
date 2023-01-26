import http from 'node:http';// tas http modulis, kuris yra node
//import fetch from 'fetch'; 3rd party sukurtas modulis, gali buti suinstaliuotas su npm i fetch, 
//atsisiunte galime naudoti jo funkcionaluma
//kad nesusipykti su node, galima butu parasyti taip:
//import fetch from 'node:fetch'; taip pasakome, kad norime nativ fetch, kuris ateina is node, ne is npm
import config from '../config.js';

const server = {};

//sukurem programa, bet jai reikia porto, kad veiktu, musu atveju localhost:11101
//si funkcija yra front-endo eventlisteneris, jai paduodami parametrai reques ir respond 
server.httpServer = http.createServer((req, res) => {
    const ssl = req.socket.encryption ? 's' : ''; //tikrinam, ar http yra https 
    const baseURL = `http${ssl}://${req.headers.host}`;
    const parseURL = new URL(req.url, baseURL); //issiaiskiname, kur kreipiamasi
    const trimmedPath = parseURL.pathname
        .replace(/^\/+|\/+$/g, '')
        .replace(/\/\/+/g, '/');

    req.on('data', () => {
        console.log('gaunami duomenys');
    })

    req.on('end', () => {
        console.log('uzklausa pilnai gauta');
        //siunciam atsakyma
        res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    CONTENT
</body>
</html>`);
    })
})

server.init = () => {
    const { port } = config; //destrukturizuojam porta(key) is config objekto
    server.httpServer.listen(port, () => {
        console.log(config);
        console.log(`Projekto nuoroda: http://localhost:${port}`);
    });
}

export { server }

