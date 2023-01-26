class PageTemplate {
    constructor() {
        this.baseTitle = 'Company';
        this.title = '';
    }

    headHTML() {
        const title = this.pageTitle === '' ? this.baseTitle : `${this.pageTitle} | ${this.baseTitle}`
        return `<head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${title}</title>
                </head>`;
    }

    headerHTML() {
        return `<header>
                    <img class="logo" src="#" alt="Logo">
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/services">Services</a>
                        <a href="/contact">Contact</a>
                    </nav>
                </header>`;
    }

    footerHTML() {
        return `<footer>
                    <p>Copyright 2023</p>
                </footer>`;
    }

    mainHTML() {
        return `<h1>SOME PAGE TEMPLATE</h1>
                <p>Lorem ipsum doler sit amet.</p>`;
    }

    render() {
        return `<!DOCTYPE html>
                <html lang="en">
                ${this.headHTML()}
                <body>
                    ${this.headerHTML()}
                    <main>
                        ${this.mainHTML()}
                    </main>
                    ${this.footerHTML()}
                </body>
                </html>`;
    }
}

export { PageTemplate }