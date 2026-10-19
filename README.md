# Week 6 — Interactive Product Hub

**Course:** PPAW — JavaScript DOM, Event Handling, and Fetch API  
**Student:** Nimra Tariq  
**NIM:** 20240140146  
**Class:** E.

## Project overview

A responsive web page demonstrating the Fetch API, JSON processing, DOM manipulation, event listeners, and form validation.

### Features

- Fetches product data from [DummyJSON Products API](https://dummyjson.com/products?limit=20).
- Displays product images, names, prices, categories, descriptions, and ratings in a responsive card layout.
- Shows loading and error messages, and includes a refresh button.
- Provides live product search.
- Includes a feedback form with required-field, email, and minimum-length validation.
- Displays dynamic success/error feedback without reloading the page.
- Uses semantic HTML and responsive CSS.

## Project structure

```text
Week6-KelasE-20240140146/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to run

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a browser, preferably with the VS Code Live Server extension.
4. Make sure you have an internet connection so the browser can request data from DummyJSON.

## API endpoint

`https://dummyjson.com/products?limit=20`

## Testing checklist

- [ ] Product cards load from the API.
- [ ] Product titles and prices appear on the page.
- [ ] Refresh button requests product data again.
- [ ] Search filters products while typing.
- [ ] Empty or invalid form fields show validation messages.
- [ ] Invalid email and short message are rejected.
- [ ] Valid form submission shows a success message without reloading.
- [ ] Layout works on desktop and mobile widths.

## Concepts demonstrated

- `fetch()` and `async/await`
- `response.ok` and `response.json()`
- `try/catch/finally` for loading and error handling
- DOM selection and element creation
- `addEventListener()` for `input`, `blur`, `click`, and `submit`
- `preventDefault()` to prevent normal form navigation
- Input validation and dynamic feedback

> Note: This is a client-side demo. The feedback form does not send or store submissions on a server.
