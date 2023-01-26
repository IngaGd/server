import { PageTemplate } from "../library/PageTemplate.js";

class PageServices extends PageTemplate {
    constructor() {
        super();
        this.pageTitle = `Services`;
    }
    mainHTML() {
        return `<h1>Services</h1>
                <p>Our services</p>`
    }
}

export { PageServices }