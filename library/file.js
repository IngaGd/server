import fs from 'fs/promises'; // metodu setas padedantis dirbti su failu sistema
import path from 'path'; // padeda operacinej sistemoj rasti kelia iki norimu resursu
import { fileURLToPath } from 'url'; // - same -


const file = {};

// pvz:
// dir = public/css
// fileName = main.css

//CRUD (f-ju akronimas) - bet koks sarasas, i kuri gali iterpti nari, gauti saraso nario info,
// atnaujinti nari, arba pasalinti (pvz e-shop prikiniu krepselis):
/*
file.create = (dir, fileName, content) => {}
file.read = (dir, fileName) => {}
file.update = (dir, fileName, content) => {}
file.delete = (dir, fileName) => {}
*/

/**
 * Sugeneruojamas absoliutus kelias iki nurodyto failo.
 * @param {string} dir Reliatyvus kelias iki direktorijos kur laikomi norimi failai, e.g. `/data/users`
 * @param {string} fileName Norimo failo pavadinimas su jo pletiniu
 * @returns {string} Absoliutus kelias iki failo
 */
file.fullPath = (dir, fileName) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '../.data', dir, fileName);
}
file.fullPublicPath = (trimmedFilePath) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '../public', trimmedFilePath);
}

/**
 * Sukuriamas failas, jei tokio dar nera nurodytoje direktorijoje.
 * @param {string} dir Reliatyvus kelias iki direktorijos kur laikomi norimi failai, pvz.: /data/users
 * @param {string} fileName Norimo failo pavadinimas su jo pletiniu
 * @param {object} content Objektas (pvz.: {...}), kuri norime irasyti i kuriama faila
 * @returns {Promise<[boolean, string | Error]>} Sekmes atveju - `true`; Klaidos atveju - klaidos pranesimas
 */
file.create = async (dir, fileName, content) => {
    let fileDescriptor = null;
    try {
        const filePath = file.fullPath(dir, fileName);  // kelias nuo C disko iki failo
        fileDescriptor = await fs.open(filePath, 'wx'); // susikuri faila, jei tokio dar nera
        await fs.writeFile(fileDescriptor, JSON.stringify(content));
        // su JSON'intas antras parametras
        return [false, 'OK']; // kuriam faila, bandom ikelti turini, jei pavylsta, ats ok
    } catch (error) {
        return [true, error]; // jei klaida, ismetam klaida
    } finally { // papildoma try catch f-ja, kuri bando ta faila uzdaryti
        // "isejes is viesbucio turi grazinti rakta", kad kiti galetu ateiti i ta kambari:)
        if (fileDescriptor) {
            fileDescriptor.close();
        } //nepriklausomai, kurioj dalyje baigesi procesas, 
    }
}

/**
 * Perskaitomas failo turinys (tekstinis failas).
 * @param {string} dir Reliatyvus kelias iki direktorijos kur laikomi norimi failai, e.g. `/data/users`
 * @param {string} fileName Norimo failo pavadinimas su jo pletiniu
 * @returns {Promise<[boolean, string | Error]>} Sekmes atveju - failo turinys; Klaidos atveju - klaida
 */
file.read = async (dir, fileName) => { // async - f-ja, kurios rez yra laukiamas, derinama su await
    try {
        const filePath = file.fullPath(dir, fileName); // nurodom kelia iki kur norim nuteiti, 
        // dir ir file name sujungiami ir gaunamas vientisas stringas
        const fileContent = await fs.readFile(filePath, 'utf-8'); // bandymas skaityti faila
        // iskvieciamas spec metodas fs.readFile,
        //  kuris pasako kelia i failiuka (filePath), ir pasako enkodinimo tipa
        // await - norint perskaityti failo turini, pasako, kiek laiko uztruks ji perskaityti
        // tuo metu, kai skaitomas failas, procesorius gali atlikti ir kitus darbus, kai baigs, gris
        return [false, fileContent]; // false is karto atsako i klausima, ar vykdant logika, pavyko
        // t.y. Ar klaida ivyko? ats false.
    } catch (error) {
        return [true, error]; // ar ivyko klaida? true
    }
}

file.readPublic = async (trimmedFilePath) => {
    try { //tol kol viskas vyksta gerai, darom sita kelia
        const filePath = file.fullPublicPath(trimmedFilePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return [false, fileContent];
    } catch (error) { // pagavus klaida, grazinti klaida
        return [true, 'Failas nerastas'];
    }
}

file.readPublicBinary = async (trimmedFilePath) => {
    try {
        const filePath = file.fullPublicPath(trimmedFilePath);
        const fileContent = await fs.readFile(filePath);
        return [false, fileContent];
    } catch (error) {
        return [true, 'Failas nerastas'];
    }
}

/**
 * JSON failo turinio atnaujinimas .data folder'yje.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} fileName Kuriamo failo pavadinimas be failo pletinio.
 * @param {Object} content JavaScript objektas, pvz.: `{name: "Marsietis"}`.
 * @returns {Promise<[boolean, string | Error]>} Pozymis, ar funkcija sekmingai atnaujintas nurodyta faila.
 */
file.update = async (dir, fileName, content) => {
    let fileDescriptor = null; // prieigos prie failo, su kuriuo noresiu dirbti raktas
    try {
        const filePath = file.fullPath(dir, fileName);
        fileDescriptor = await fs.open(filePath, 'r+'); // atodaromas failas su galimybe overridinti
        // jei tokio failo nera, ji dar ir papildomai sukurs
        await fileDescriptor.truncate();
        await fs.writeFile(fileDescriptor, JSON.stringify(content));
        return [false, 'OK'];
    } catch (error) {
        return [true, error];
    } finally {
        if (fileDescriptor) {
            await fileDescriptor.close();
        }
    }
}

/**
 * JSON failo istrinimas .data folder'yje.
 * @param {string} dir Sub-folder'is esantis .data folder'yje.
 * @param {string} fileName Kuriamo failo pavadinimas be failo pletinio.
 * @returns {Promise<[boolean, string | Error]>} Pozymis, ar funkcija sekmingai istrintas nurodyta faila.
 */
file.delete = async (dir, fileName) => {
    try {
        const filePath = file.fullPath(dir, fileName);
        await fs.unlink(filePath);
        return [false, 'OK'];
    } catch (error) {
        return [true, error];
    }
}

export { file }