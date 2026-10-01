// ==UserScript==
// @name         Auto-dismiss ChatGPT banner
// @namespace    local
// @version      1.1
// @description  Automatically dismisses the large ChatGPT "Get Pro" banner, that appears right over the chat input.
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const SELECTOR =
        'button[aria-label="Dismiss ChatGPT beacon banner"]';

    function dismissBanner() {
        const button = document.querySelector(SELECTOR);

        if (!button) {
            return false;
        }

        button.click();
        console.log('[userscript] Closed ChatGPT beacon banner');
        return true;
    }

    // Handle it if already present when the userscript runs.
    if (dismissBanner()) {
        return;
    }

    // Otherwise wait for it to be inserted dynamically.
    const observer = new MutationObserver(() => {
	if (dismissBanner()) {
        //    observer.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
