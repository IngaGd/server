import { server } from "./library/server.js";

const app = {};

//pradedam projekta
app.init = () => {
    //reikia ne visiems:
    //trukstamo pradinio turinio generavimas:
    // - folder
    // - file

    //gauti prisijungima prie DB
    //uzkurti serveri (DBconnection)
    server.init();

    //const timer = setInterval(() => {
    //  console.log('apsivalymas..')
    //      reguliarus procesai:
    //      - info ssinchronizavimas/atsinaujinimas
    //      - failu archyvavimas
    //      - info agregavimas (statistika)
    //      - nereikalingos info salinimas:
    //             - failu trinimas
    //             - DB optimizavimas
    //}, 5000);

}

app.init();

export { app }