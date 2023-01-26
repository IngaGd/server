import { PageTemplate } from "../library/PageTemplate.js";

class Page404 extends PageTemplate {
    constructor() {
        super(); //super leidzia overidinti tevo konstruktoriaus reiksmes, jei inherit kelis kartus, tai siekia pacias saknis
        this.pageTitle = `404`;
    }

    mainHTML() {
        return `<h1>404</h1>
                <p>Page not found</p>`
    }
}

export { Page404 }