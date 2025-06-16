// ==UserScript==
// @name         Virtual Keyboard
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Virtual Keyboard by peruvajs
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentLayout = 'ru', previousLayout = 'ru', isUpperCase = false, inputField = null;

    const layouts = {
        en: [['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l'],['z','x','c','v','b','n','m']],
        ru: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],['й','ц','у','к','е','н','г','ш','щ','з','х','ъ'],['ф','ы','в','а','п','р','о','л','д','ж','э'],['я','ч','с','м','и','т','ь','б','ю']],
        symbols: [['!','@','#','$','%','^','&','*','(',')','-','_'],['=','+','[',']','{','}','\\','|',';',':'],['"',"'",',','.','/','?','<','>']]
    };

    const style = `
        #virtualKeyboard {
            position: fixed; bottom: 0; left: 0; width: 100%; background: #f0f0f0;
            border-top: 2px solid #ccc; padding: 8px 5px; z-index: 99999;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2); user-select: none;
        }
        .vk-row { display: flex; justify-content: center; margin-bottom: 6px; flex-wrap: wrap; }
        .vk-key {
            margin: 4px; padding: 16px 20px; font-size: 18px; background: #fff;
            border: 1px solid #bbb; border-radius: 6px; cursor: pointer;
            user-select: none; touch-action: manipulation; min-width: 40px;
            text-align: center; transition: background-color 0.1s ease;
        }
        .vk-key:active { background-color: #d0d0d0; }
        .vk-func { background: #dcdcdc; }
        .vk-hidden { display: none !important; }
        .vk-close-btn {
			position: absolute;
			top: 8px;
			right: 16px;
			width: 48px;
			height: 48px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36px;
			cursor: pointer;
			color: #666;
			border-radius: 50%;
			background: rgba(0,0,0,0.1);
			user-select: none;
			transition: background 0.2s ease;
		}
		.vk-close-btn:hover {
			background: rgba(0,0,0,0.2);
		}
	`;

    const injectStyle = () => {
        const styleTag = document.createElement('style');
        styleTag.textContent = style;
        document.head.appendChild(styleTag);
    };

    const createKeyboard = () => {
        if (document.getElementById('virtualKeyboard')) return;
        const kb = document.createElement('div');
        kb.id = 'virtualKeyboard';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'vk-close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            document.getElementById('virtualKeyboard')?.remove();
            inputField?.blur();
        });
        kb.appendChild(closeBtn);

        document.body.appendChild(kb);
        renderLayout(kb);
    };

    let backspaceTimer, backspaceInterval;

    const createBackspaceKey = () => {
        const btn = document.createElement('div');
        btn.className = 'vk-key vk-func';
        btn.textContent = '⌫';
        btn.addEventListener('pointerdown', e => {
            e.preventDefault();
            backspace();
            backspaceTimer = setTimeout(() => {
                backspaceInterval = setInterval(backspace, 80);
            }, 800);
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev =>
            btn.addEventListener(ev, clearBackspaceTimers));
        return btn;
    };

    const clearBackspaceTimers = () => {
        clearTimeout(backspaceTimer);
        clearInterval(backspaceInterval);
    };

    const renderLayout = (container) => {
        const closeBtn = container.firstChild;
        container.innerHTML = '';
        container.appendChild(closeBtn);

        const layout = layouts[currentLayout];

        layout.forEach((row, i) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'vk-row';
            row.forEach(char => {
                const btn = document.createElement('div');
                btn.className = 'vk-key';
                btn.textContent = isUpperCase ? char.toUpperCase() : char;
                btn.addEventListener('pointerdown', () => insertChar(char));
                rowDiv.appendChild(btn);
            });

            if (i === layout.length - 1) rowDiv.appendChild(createBackspaceKey());

            container.appendChild(rowDiv);

            if (i === 0) {
                const divider = document.createElement('hr');
                divider.style.margin = '10px auto';
				divider.style.width = 'min(1064px, 90%)';
				divider.style.border = 'none';
				divider.style.borderTop = '2px solid #ccc';
                container.appendChild(divider);
            }
        });

        const controlRow = document.createElement('div');
        controlRow.className = 'vk-row';

        const toggleCase = createFuncKey(isUpperCase ? 'abc' : 'ABC', () => {
            isUpperCase = !isUpperCase;
            renderLayout(container);
        });
        toggleCase.id = 'vk-case';

        const langToggle = createFuncKey('🌐', () => {
            currentLayout = currentLayout === 'ru' ? 'en' : 'ru';
            renderLayout(container);
        });
        langToggle.id = 'vk-lang';

        const symbolsToggle = createFuncKey('#$%', () => {
            if (currentLayout === 'symbols') {
                currentLayout = previousLayout;
            } else {
                previousLayout = currentLayout;
                currentLayout = 'symbols';
            }
            renderLayout(container);
        });

        const spacer = () => {
            const el = document.createElement('div');
            el.className = 'vk-key vk-func';
            el.style.visibility = 'hidden';
            el.style.minWidth = '12px';
            return el;
        };

        const spaceKey = createFuncKey(' ', () => insertChar(' '));
        spaceKey.style.minWidth = '280px';

        const leftArrow = createFuncKey('⬅', () => moveCursor(-1));
        const rightArrow = createFuncKey('➡', () => moveCursor(1));

        [toggleCase, langToggle, symbolsToggle, spacer(), spaceKey, spacer(), leftArrow, rightArrow]
            .forEach(btn => controlRow.appendChild(btn));

        container.appendChild(controlRow);

        document.getElementById('vk-lang')?.classList.toggle('vk-hidden', currentLayout === 'symbols');
        document.getElementById('vk-case')?.classList.toggle('vk-hidden', currentLayout === 'symbols');
    };

    const createFuncKey = (label, action) => {
        const btn = document.createElement('div');
        btn.className = 'vk-key vk-func';
        btn.textContent = label;
        btn.addEventListener('pointerdown', e => {
            e.preventDefault();
            action();
        });
        return btn;
    };

    const insertChar = (char) => {
        if (!inputField) return;
        const insert = isUpperCase ? char.toUpperCase() : char;
        const start = inputField.selectionStart, end = inputField.selectionEnd;
        const before = inputField.value.slice(0, start), after = inputField.value.slice(end);
        inputField.value = before + insert + after;
        inputField.selectionStart = inputField.selectionEnd = start + insert.length;
        inputField.focus();
    };

    const backspace = () => {
        if (!inputField) return;
        const start = inputField.selectionStart, end = inputField.selectionEnd;
        if (start === 0 && end === 0) return;
        const before = inputField.value.slice(0, start), after = inputField.value.slice(end);
        const newStart = start === end ? start - 1 : start;
        inputField.value = before.slice(0, newStart) + after;
        inputField.selectionStart = inputField.selectionEnd = newStart;
        inputField.focus();
    };

    const moveCursor = offset => {
        if (!inputField) return;
        let pos = inputField.selectionStart + offset;
        pos = Math.max(0, Math.min(pos, inputField.value.length));
        inputField.selectionStart = inputField.selectionEnd = pos;
        inputField.focus();
    };

    document.addEventListener('focusin', e => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            inputField = e.target;
            createKeyboard();
        }
    });

    injectStyle();
})();