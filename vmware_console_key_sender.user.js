// ==UserScript==
// @name        VMware Console Key Sender
// @namespace   https://github.com/dfaerch
// @version     1.0
// @description Paste any text into VMware web console
// @match       https://*/ui/webconsole.html*
// @grant       none
// ==/UserScript==

(function () {
    const KEYMAP = generateKeyMap();

    function generateKeyMap() {
        const map = {};
        for (let i = 0; i < 26; i++) {
            const ch = String.fromCharCode(97 + i);
            const upper = ch.toUpperCase();
            map[ch] = { code: `Key${upper}` };
            map[upper] = { code: `Key${upper}`, shift: true };
        }

        const digitCodes = ['Digit0','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9'];
        const shiftedDigits = [')','!','@','#','$','%','^','&','*','('];
        for (let i = 0; i <= 9; i++) {
            map[String(i)] = { code: digitCodes[i] };
            map[shiftedDigits[i]] = { code: digitCodes[i], shift: true };
        }

        Object.assign(map, {
            '-': { code: 'Minus' },
            '_': { code: 'Minus', shift: true },
            '=': { code: 'Equal' },
            '+': { code: 'Equal', shift: true },
            '[': { code: 'BracketLeft' },
            '{': { code: 'BracketLeft', shift: true },
            ']': { code: 'BracketRight' },
            '}': { code: 'BracketRight', shift: true },
            '\\': { code: 'Backslash' },
            '|': { code: 'Backslash', shift: true },
            ';': { code: 'Semicolon' },
            ':': { code: 'Semicolon', shift: true },
            "'": { code: 'Quote' },
            '"': { code: 'Quote', shift: true },
            ',': { code: 'Comma' },
            '<': { code: 'Comma', shift: true },
            '.': { code: 'Period' },
            '>': { code: 'Period', shift: true },
            '/': { code: 'Slash' },
            '?': { code: 'Slash', shift: true },
            '`': { code: 'Backquote' },
            '~': { code: 'Backquote', shift: true },
            ' ': { code: 'Space' },
            '\n': { code: 'Enter', keyCode: 13 },
        });

        return map;
    }

    function dispatchKey(el, type, opts) {
        const ev = new KeyboardEvent(type, opts);
        el.dispatchEvent(ev);
    }

    function sendChar(el, char) {
        const info = KEYMAP[char];
        if (!info) {
            console.warn('No keymap for:', JSON.stringify(char));
            return;
        }

        const baseOpts = {
            key: char,
            code: info.code,
            keyCode: info.keyCode ?? char.charCodeAt(0),
            which: info.which ?? char.charCodeAt(0),
            bubbles: true,
            cancelable: true,
            composed: true,
            shiftKey: !!info.shift,
        };

        if (info.shift) {
            const shiftDown = {
                key: 'Shift',
                code: 'ShiftLeft',
                keyCode: 16,
                which: 16,
                bubbles: true,
                cancelable: true,
                composed: true,
                shiftKey: true,
            };
            dispatchKey(el, 'keydown', shiftDown);
            dispatchKey(el, 'keydown', baseOpts);
            dispatchKey(el, 'keypress', baseOpts);
            dispatchKey(el, 'keyup', baseOpts);
            dispatchKey(el, 'keyup', shiftDown);
        } else {
            dispatchKey(el, 'keydown', baseOpts);
            dispatchKey(el, 'keypress', baseOpts);
            dispatchKey(el, 'keyup', baseOpts);
        }
    }

    function typeIntoCanvas(canvas, str, delay = 60) {
        canvas.focus();
        let i = 0;
        const interval = setInterval(() => {
            if (i >= str.length) return clearInterval(interval);
            sendChar(canvas, str[i++]);
        }, delay);
    }

    function injectUI() {
        const wrap = document.createElement('div');
        Object.assign(wrap.style, {
            position: 'fixed',
            top: '40px',
            right: '10px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            background: '#222',
            padding: '4px',
            borderRadius: '4px',
        });

        const ta = document.createElement('textarea');
        ta.rows = 3;
        ta.cols = 30;
        ta.placeholder = 'Type keys to send...';
        Object.assign(ta.style, {
            resize: 'none',
            fontSize: '14px',
        });

        const realText = { value: '' };

        const row = document.createElement('div');
        Object.assign(row.style, {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
        });

        const btn = document.createElement('button');
        btn.textContent = 'Send to console';
        Object.assign(btn.style, {
            fontSize: '14px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            padding: '8px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
        });

        const label = document.createElement('label');
        label.textContent = 'Password';
        Object.assign(label.style, {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: '#ccc',
            fontSize: '14px',
            cursor: 'pointer',
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        label.prepend(checkbox);
        row.appendChild(btn);
        row.appendChild(label);

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                realText.value = ta.value;
                ta.value = '*'.repeat(realText.value.length);
            } else {
                ta.value = realText.value;
            }
        });

        ta.addEventListener('input', () => {
            if (checkbox.checked) {
                const newText = ta.value;
                const prev = realText.value;
                if (newText.length < prev.length) {
                    realText.value = prev.slice(0, newText.length);
                } else {
                    const added = newText.length - prev.length;
                    const typed = prompt(`Enter ${added} new character(s):`);
                    if (typed) realText.value += typed.slice(0, added);
                }
                ta.value = '*'.repeat(realText.value.length);
            } else {
                realText.value = ta.value;
            }
        });

        btn.onclick = () => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return alert('No canvas found');
            canvas.setAttribute('tabindex', '-1');
            canvas.focus();
            canvas.click();
            const txt = checkbox.checked ? realText.value : ta.value;
            setTimeout(() => {
                typeIntoCanvas(canvas, txt);
            }, 200);
        };

        wrap.appendChild(ta);
        wrap.appendChild(row);
        document.body.appendChild(wrap);
        console.log('[init] UI injected');
    }

    if (document.body) injectUI();
    else window.addEventListener('DOMContentLoaded', injectUI);
})();

