const utils = {};

utils.fileExtension = (url) => { // gaunam url, t.y. trimmedPath

    // 'css/main.js?v=2 -> js    url parametrai

    const parts = url.split('?')[0].split('.');
    return parts.length === 1 ? '' : parts.at(-1);

}

export { utils }