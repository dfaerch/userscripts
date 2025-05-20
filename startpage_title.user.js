// ==UserScript==
// @name         Put Startpage.com Query in Title
// @namespace    https://github.com/dfaerch
// @version      1.1
// @description  Add Startpage.com search query to page title, like other search engines.
// @author       dfaerch
// @match        *://*.startpage.com/*search*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(() => {
    const input = document.querySelector('input[name="query"], input#q');
    if (input && input.value) {
        document.title = `${input.value} - Startpage`;
    }
})();

