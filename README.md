**vk-js** — это минималистичный JavaScript-скрипт, реализующий виртуальную клавиатуру с русской, английской раскладкой, а также раскладку со специальными символами. Клавиатура автоматически появляется при фокусе на текстовых полях (`<input>`, `<textarea>`), позволяет вводить текст без физической клавиатуры и включает поддержку регистра, перемещения курсора и удержания Backspace.

## Установка через Tampermonkey

1. Установить расширение [Tampermonkey](https://www.tampermonkey.net/) для браузера (Chrome, Firefox, Edge и др.)
2. Создать новый скрипт
3. Вставить содержимое файла `vk-js.js`
4. Сохранить и обновить страницу
5. При фокусе на поле ввода появится клавиатура

### Запуск через консоль браузера:

1. Открыть DevTools (`F12` или `Ctrl+Shift+I`) → вкладка **Console**
2. Вставить скрипт без Tampermonkey-заголовков (`// ==UserScript== ... // ==/UserScript==`)
3. Обернуть в самовызывающуюся функцию:

```js
(() => {
  // код скрипта
})();
```

---

**vk-js** is a minimalist JavaScript script that implements a virtual keyboard with Russian, English, and special symbol layouts. The keyboard automatically appears when focusing on text fields (<input>, <textarea>), allows typing without a physical keyboard, and supports case switching, cursor movement, and long-press Backspace.

## Installation via Tampermonkey

1. Install the Tampermonkey extension for your browser (Chrome, Firefox, Edge, etc.)
2. Create a new script
3. Paste the contents of the `vk-js.js` file
4. Save and refresh the page
5. The keyboard will appear when focusing on an input field

## Running via browser console:

1. Open DevTools (`F12` or `Ctrl+Shift+I`) → **Console** tab
2. Paste the script code without Tampermonkey headers (`// ==UserScript== ... // ==/UserScript==`)
3. Wrap it in a self-invoking function:

```js
(() => {
  // script code
})();
```
