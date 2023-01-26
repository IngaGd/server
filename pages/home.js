import { PageTemplate } from "../library/PageTemplate.js";

class PageHome extends PageTemplate {
    constructor() {
        super();
        this.pageTitle = `Home`;
    }
    mainHTML() {
        return `<h1>Welcome to Home Page</h1>`;
    }
}

export { PageHome }