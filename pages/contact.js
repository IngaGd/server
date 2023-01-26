import { PageTemplate } from "../library/PageTemplate.js";

class PageContact extends PageTemplate {
    constructor() {
        super();
        this.pageTitle = `Contacts`;
    }
    mainHTML() {
        return `<h1>Contacts</h1>
                <p>Content</p>`
    }
}

export { PageContact }