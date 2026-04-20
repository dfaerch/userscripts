// ==UserScript==
// @name         YouTube Transcript Copy
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Copy YouTube video transcripts with timestamps
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_setClipboard
// @license MIT
// ==/UserScript==

(function () {
    'use strict';

    console.log('YouTube Transcript Copy script loaded.');

    let initTimer = null;
    let lastUrl = location.href;

    function waitForElements(selectors, callback, interval = 500, timeout = 30000) {
        const startTime = Date.now();

        const checkExist = setInterval(() => {
            const elements = selectors.map(selector => document.querySelector(selector));

            if (elements.every(el => el)) {
                clearInterval(checkExist);
                callback(...elements);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkExist);
                console.log(`Timeout waiting for elements: ${selectors.join(', ')}`);
            }
        }, interval);
    }

    function waitForTranscriptSegments(callback, interval = 100, timeout = 15000) {
        const startTime = Date.now();

        const checkExist = setInterval(() => {
            const transcriptPanel = document.querySelector(
                'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'
            );

            const segments = document.querySelectorAll(
                'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"] ytd-transcript-segment-renderer'
            );

            if (transcriptPanel && segments.length > 0) {
                clearInterval(checkExist);
                callback(segments);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkExist);
                console.log('Timeout waiting for transcript segments.');
                alert('Transcript panel opened, but no transcript text was found.');
            }
        }, interval);
    }

    function extractTranscriptText(segments) {
        return Array.from(segments)
            .map(segment => {
                const timestamp =
                    segment.querySelector('.segment-timestamp')?.textContent.trim() ||
                    segment.querySelector('#timestamp')?.textContent.trim();

                const text =
                    segment.querySelector('.segment-text')?.textContent.trim() ||
                    segment.querySelector('#segment-text')?.textContent.trim();

                if (!text) return null;
                return timestamp ? `${timestamp} ${text}` : text;
            })
            .filter(Boolean)
            .join('\n');
    }

    function isWatchPage() {
        return location.pathname === '/watch' && new URL(location.href).searchParams.has('v');
    }

    function removeOldButton() {
        const oldButton = document.getElementById('copy-transcript-button');
        if (oldButton) oldButton.remove();
    }

    function findShowTranscriptButton() {
        /*
         * Original selector first because it worked for you.
         * Fallbacks handle some newer layouts.
         */
        return (
            document.querySelector('#primary-button > ytd-button-renderer > yt-button-shape > button') ||
            Array.from(document.querySelectorAll('button, yt-button-shape button, ytd-button-renderer button'))
                .find(button => {
                    const label = [
                        button.innerText,
                        button.textContent,
                        button.getAttribute('aria-label'),
                        button.getAttribute('title')
                    ].filter(Boolean).join(' ');

                    return /transcript/i.test(label);
                })
        );
    }

    function findPlacementElement() {
        return (
            document.querySelector('#buttons > ytd-button-renderer') ||
            document.querySelector('#top-level-buttons-computed') ||
            document.querySelector('#actions-inner') ||
            document.querySelector('#top-row') ||
            document.querySelector('#above-the-fold')
        );
    }

    function insertCopyButton(showTranscriptButton, placementElement) {
        if (!isWatchPage()) return;

        if (document.getElementById('copy-transcript-button')) {
            console.log('Copy Transcript button already exists.');
            return;
        }

        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Transcript';
        copyButton.id = 'copy-transcript-button';
        copyButton.style = 'margin-left: 8px; padding: 5px 10px; background-color: #33691e; color: #FFFFFF; border: none; border-radius: 4px; cursor: pointer;';
        console.log('Created Copy Transcript button.');

        placementElement.appendChild(copyButton);
        console.log('Inserted Copy Transcript button into the page.', placementElement);

        copyButton.addEventListener('click', function () {
            console.log('Copy Transcript button clicked.');

            const currentShowTranscriptButton = findShowTranscriptButton() || showTranscriptButton;

            if (!currentShowTranscriptButton) {
                console.log('Show Transcript button not found.');
                alert('Show Transcript button not found.');
                return;
            }

            currentShowTranscriptButton.click();
            console.log('Show Transcript button clicked programmatically.');

            waitForTranscriptSegments((segments) => {
                console.log('Transcript segments found and loaded.');

                const videoTitle = document.title.replace(/\s*-\s*YouTube\s*$/, '');
                console.log('Video title:', videoTitle);

                const transcriptText = extractTranscriptText(segments);

                if (!transcriptText.trim()) {
                    console.log('Transcript text is empty.');
                    alert('Transcript found, but no transcript text could be extracted.');
                    return;
                }

                const fullTranscript = `Video title: ${videoTitle}\n\n${transcriptText}`;
                console.log('Prepared full transcript with title.');

                GM_setClipboard(fullTranscript, 'text');
                console.log('Copied full transcript to clipboard.');

                alert('Transcript with title copied to clipboard!');
            });
        });
    }

    function init() {
        console.log('Initializing YouTube Transcript Copy.');

        if (!isWatchPage()) {
            removeOldButton();
            return;
        }

        if (document.getElementById('copy-transcript-button')) {
            return;
        }

        if (initTimer) {
            clearInterval(initTimer);
            initTimer = null;
        }

        const startTime = Date.now();

        initTimer = setInterval(() => {
            const showTranscriptButton = findShowTranscriptButton();
            const placementElement = findPlacementElement();

            if (showTranscriptButton && placementElement) {
                clearInterval(initTimer);
                initTimer = null;

                console.log('Elements found:', { showTranscriptButton, placementElement });
                insertCopyButton(showTranscriptButton, placementElement);
                return;
            }

            if (Date.now() - startTime > 30000) {
                clearInterval(initTimer);
                initTimer = null;
                console.log('Timeout waiting for YouTube transcript/placement elements.');
            }
        }, 500);
    }

    function delayedInit() {
        setTimeout(init, 250);
        setTimeout(init, 1000);
        setTimeout(init, 2500);
        setTimeout(init, 5000);
    }

    function handleNavigation() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('YouTube navigation detected:', lastUrl);
            removeOldButton();
        }

        delayedInit();
    }

    /*
     * Hard reload / direct video load.
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', delayedInit);
    } else {
        delayedInit();
    }

    /*
     * YouTube SPA navigation.
     */
    document.addEventListener('yt-navigate-finish', handleNavigation);
    document.addEventListener('yt-page-data-updated', handleNavigation);
    document.addEventListener('yt-page-type-changed', handleNavigation);

    /*
     * DOM fallback.
     */
    const observer = new MutationObserver(() => {
        if (isWatchPage() && !document.getElementById('copy-transcript-button')) {
            init();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
