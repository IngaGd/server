import http from 'node:http';// tas http modulis, kuris yra node
//import fetch from 'fetch'; 3rd party sukurtas modulis, gali buti suinstaliuotas su npm i fetch, 
//atsisiunte galime naudoti jo funkcionaluma
//kad nesusipykti su node, galima butu parasyti taip:
//import fetch from 'node:fetch'; taip pasakome, kad norime nativ fetch, kuris ateina is node, ne is npm
import config from '../config.js';

import { PageHome } from '../pages/home.js';
import { PageAbout } from '../pages/about.js';
import { PageServices } from '../pages/services.js';
import { Page404 } from '../pages/404.js';
import { PageContact } from '../pages/contact.js';

const server = {};

//sukurem programa, bet jai reikia porto, kad veiktu, musu atveju localhost:11101
//si funkcija yra front-endo eventlisteneris, jai paduodami parametrai reques ir respond 
server.httpServer = http.createServer((req, res) => {
    const ssl = req.socket.encryption ? 's' : ''; //tikrinam, ar http yra https 
    const baseURL = `http${ssl}://${req.headers.host}`;
    const parseURL = new URL(req.url, baseURL); // issiaiskiname, kur kreipiamasi
    const trimmedPath = parseURL.pathname
        .replace(/^\/+|\/+$/g, '')
        .replace(/\/\/+/g, '/');

    req.on('data', () => {
        console.log('gaunami duomenys');
    })

    req.on('end', () => {
        console.log('uzklausa pilnai gauta');
        //siunciam atsakyma

        let PageClass = server.routes[404];
        if (trimmedPath in server.routes) { //ar reiksme yra viena is objekto key?
            PageClass = server.routes[trimmedPath]; //istrauki raktazodi is objekto ir ji priskirti
        }

        const page = new PageClass()
        res.end(page.render());
    })
})

server.routes = {
    '': PageHome,
    'about': PageAbout,
    'servicers': PageServices,
    'contact': PageContact,
    '404': Page404,
};

server.init = () => {
    const { port } = config; //destrukturizuojam porta(key) is config objekto
    server.httpServer.listen(port, () => {
        console.log(config);
        console.log(`Projekto nuoroda: http://localhost:${port}`);
    });
}

export { server }

