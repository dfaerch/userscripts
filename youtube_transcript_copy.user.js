// ==UserScript==
// @name         YouTube Transcript Copy
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Copy YouTube video transcripts with timestamps
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        GM_setClipboard
// @license MIT
// ==/UserScript==

(function () {
    'use strict';

    console.log('YouTube Transcript Copy script loaded.'); // Log when the script is loaded

    // Function to wait for multiple elements to exist in the DOM
    function waitForElements(selectors, callback, interval = 500, timeout = 300000) {
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

    // Function to create and insert the Copy Transcript button
    function insertCopyButton(showTranscriptButton, placementElement) {
        if (document.getElementById('copy-transcript-button')) {
            console.log('Copy Transcript button already exists.');
            return;
        }

        // Create the Copy Transcript button
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy Transcript';
        copyButton.id = 'copy-transcript-button';
        copyButton.style = 'margin-left: 8px; padding: 5px 10px; background-color: #33691e; color: #FFFFFF; border: none; border-radius: 4px; cursor: pointer;';
        console.log('Created Copy Transcript button.');

        // Insert the button in the desired location
        placementElement.appendChild(copyButton);
        console.log('Inserted Copy Transcript button into the page.', placementElement);

        // Add click event listener to the Copy Transcript button
        copyButton.addEventListener('click', function () {
            console.log('Copy Transcript button clicked.');

            // Click the "Show transcript" button to ensure the transcript is visible
            showTranscriptButton.click();
            console.log('Show Transcript button clicked programmatically.');

            // Wait for the transcript to load
            waitForElements([
                'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'
            ], (transcriptPanel) => {
                if (transcriptPanel.innerText.trim() !== '') {
                    console.log('Transcript panel found and loaded.');

                    // Get the video title
                    const videoTitle = document.title.replace(' - YouTube', '');
                    console.log('Summerize and explain the video title:', videoTitle);

                    // Combine the title and transcript
                    const fullTranscript = `Video title: ${videoTitle}\n\n${transcriptPanel.innerText}`;
                    console.log('Prepared full transcript with title.');

                    // Copy the full transcript text to clipboard
                    GM_setClipboard(fullTranscript, 'text');
                    console.log('Copied full transcript to clipboard.');

                    // Show notification
                    alert('Transcript with title copied to clipboard!');
                } else {
                    console.log('Transcript panel is empty.');
                }
            });
        });
    }

    // Wait for both the "Show transcript" button and the placement element to exist
    waitForElements(
        [
            '#primary-button > ytd-button-renderer > yt-button-shape > button',
            '#buttons > ytd-button-renderer'
        ],
        (showTranscriptButton, placementElement) => {
            console.log('Elements found:', { showTranscriptButton, placementElement });
            insertCopyButton(showTranscriptButton, placementElement);
        }
    );
})();

