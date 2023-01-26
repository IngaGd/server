import { PageTemplate } from "../library/PageTemplate.js";

class PageAbout extends PageTemplate {
    constructor() {
        super();
        this.pageTitle = `About`;
    }
    mainHTML() {
        return `<h1>About us</h1>
                <p>Content</p>`
    }
}

export { PageAbout }