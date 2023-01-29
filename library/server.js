import http from 'node:http';// tas http modulis, kuris yra node
//import fetch from 'fetch'; 3rd party sukurtas modulis, gali buti suinstaliuotas su npm i fetch, 
//atsisiunte galime naudoti jo funkcionaluma
//kad nesusipykti su node, galima butu parasyti taip:
//import fetch from 'node:fetch'; taip pasakome, kad norime nativ fetch, kuris ateina is node, ne is npm
import config from '../config.js';
import { utils } from './utility.js';

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

    const extension = utils.fileExtension(trimmedPath);

    const textFileExtensions = ['css', 'js', 'txt', 'svg', 'xml', 'webmanifest', 'md', 'markdown'];
    const textBinaryExtensions = ['jpg', 'jpeg', 'png', 'ico', 'webp', 'mp3', 'woff2', 'woff', 'ttf'];

    const isTextFile = textFileExtensions.includes(extension);
    const isBinaryFile = textBinaryExtensions.includes(extension);
    const isAPI = trimmedPath.startsWith('api/'); // API - speciali nuoroda, kur frontui viska siusti
    //pvz.: https://www.puslapis.lt/api/regirster - kaip ir puslapis, bet kreipiasi i musu api logika,
    // siuo atveju klientas siuncia info, uz jo, pvz /register - norimos iskviesti funkcijos pavadinimas
    // teoriskai galime atsiusti objekta i ta tevini api kelia, ir tame objekte nurodyti keyworda 
    // key value poros, kur butu pasakyta, o kokiai f-jai skirta ir tada api turi issiaiskinti, ar turim
    // tokia f-ja, ar ne, bandyti ja iskviesti ir tada paduoti likusius parametrus
    const isPage = !isTextFile && !isBinaryFile && !isAPI;


    req.on('data', () => {
        console.log('gaunami duomenys');
    })

    req.on('end', () => {
        //siunciam atsakyma

        if (isTextFile) { //klientas praso infromacijos
            // rasti faila
            // jei radau -> perskaityti jo turini
            // jei neradau -? klaisos pranesimas
            /*const [err, content] = await file.readPublic(trimmedPath);
            res.writeHead(err ? 404 : 200, {
                'Content-Type': MIMES[extension],
                'cache-control': `max-age=${err ? 0 : config.cache}`,
            });
            return res.end(err ? 'Sorry, tokiu failo nera...' : content);*/
            return res.end('gavau css');
        }

        /*

        if (isBinaryFile) { //klientas praso infromacijos
            const [err, content] = await file.readPublicBinary(trimmedPath);
            res.writeHead(err ? 404 : 200, {
                'Content-Type': MIMES[extension],
                'cache-control': `max-age=${err ? 0 : config.cache}`,
            });
            return res.end(err ? 'Sorry, tokiu failo nera...' : content);
        }

        if (isAPI) { // klientas duoda informacija ir dar praso atlikti veiksmus, pvz istraukti duomenis ir jo accounto
            // "laikinas" sprendimas 👀
            const [err, content] = [false, 'API funkcijos atsakymas'];

            res.writeHead(err ? 404 : 200, {
                'Content-Type': err ? MIMES.txt : MIMES.json,
            });
            return res.end(err ? 'Sorry, nezinau ko nori...' : JSON.stringify(content));
        }*/

        // Puslapio klase, kuri renderina HTML koda
        //if (isPage) {
        let PageClass = server.routes[404];
        if (trimmedPath in server.routes) { //ar reiksme yra viena is objekto key?
            PageClass = server.routes[trimmedPath]; //istrauki raktazodi is objekto ir ji priskirti
        }

        const page = new PageClass()
        res.end(page.render());
        //}
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

