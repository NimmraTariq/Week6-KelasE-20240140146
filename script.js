// PPAW Week 6: Fetch API, DOM manipulation, and event handling.

const API_URL = "https://dummyjson.com/products?limit=20";

const productGrid = document.querySelector("#product-grid");
const productsStatus = document.querySelector("#products-status");
const resultsCount = document.querySelector("#results-count");
const searchInput = document.querySelector("#product-search");
const refreshButton = document.querySelector("#refresh-products");

let allProducts = [];

// Format a number as a price in US dollars.
function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price);
}

// Create product cards safely with DOM methods (not HTML strings).
function renderProducts(products) {
  productGrid.replaceChildren();

  if (products.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No products match your search. Try another keyword.";
    productGrid.append(emptyState);
    resultsCount.textContent = "0 products found";
    return;
  }

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image-wrap";

    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = product.category || "Product";

    const image = document.createElement("img");
    image.src = product.thumbnail || "";
    image.alt = product.title ? `${product.title} product image` : "Product image";
    image.loading = "lazy";
    image.onerror = () => {
      image.style.display = "none";
      imageWrap.classList.add("image-unavailable");
    };

    imageWrap.append(image, category);

    const details = document.createElement("div");
    details.className = "product-details";

    const title = document.createElement("h3");
    title.className = "product-title";
    title.textContent = product.title;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description || "No description available.";

    const meta = document.createElement("div");
    meta.className = "product-meta";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const rating = document.createElement("span");
    rating.className = "product-rating";
    rating.textContent = `★ ${Number(product.rating || 0).toFixed(1)}`;

    meta.append(price, rating);
    details.append(title, description, meta);
    card.append(imageWrap, details);
    fragment.append(card);
  });

  productGrid.append(fragment);
  resultsCount.textContent = `${products.length} ${products.length === 1 ? "product" : "products"} shown`;
}

// Fetch product data from the DummyJSON API.
async function loadProducts() {
  productsStatus.hidden = false;
  productsStatus.classList.remove("error");
  productsStatus.textContent = "Loading products from DummyJSON…";
  productGrid.replaceChildren();
  resultsCount.textContent = "Loading…";
  refreshButton.disabled = true;
  refreshButton.style.opacity = "0.65";

  try {
    const response = await fetch(API_URL);

    // fetch() does not reject automatically for HTTP error responses.
    if (!response.ok) {
      throw new Error(`The server returned status ${response.status}.`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.products)) {
      throw new Error("The API returned data in an unexpected format.");
    }

    allProducts = data.products;
    renderProducts(allProducts);
    productsStatus.hidden = true;
  } catch (error) {
    productsStatus.classList.add("error");
    productsStatus.textContent =
      "We couldn't load the products. Please check your internet connection and try again.";
    resultsCount.textContent = "Catalog unavailable";
    console.error("Fetch API error:", error);
  } finally {
    refreshButton.disabled = false;
    refreshButton.style.opacity = "1";
  }
}

// Event handling: filter the rendered product data as the user types.
searchInput.addEventListener("input", (event) => {
  const keyword = event.target.value.trim().toLowerCase();
  const filteredProducts = allProducts.filter((product) =>
    `${product.title} ${product.category} ${product.description}`
      .toLowerCase()
      .includes(keyword)
  );
  renderProducts(filteredProducts);
});

// Event handling: reload data when the refresh button is clicked.
refreshButton.addEventListener("click", loadProducts);

// Form DOM references.
const feedbackForm = document.querySelector("#feedback-form");
const nameInput = document.querySelector("#full-name");
const emailInput = document.querySelector("#email");
const topicInput = document.querySelector("#topic");
const messageInput = document.querySelector("#message");
const characterCount = document.querySelector("#character-count");
const formFeedback = document.querySelector("#form-feedback");

const fields = [
  { input: nameInput, error: document.querySelector("#name-error") },
  { input: emailInput, error: document.querySelector("#email-error") },
  { input: topicInput, error: document.querySelector("#topic-error") },
  { input: messageInput, error: document.querySelector("#message-error") }
];

// Validate a single field and display feedback beside it.
function validateField(input, errorElement) {
  const value = input.value.trim();
  let message = "";

  if (!value) {
    message = "This field is required.";
  } else if (input === nameInput && value.length < 2) {
    message = "Please enter at least 2 characters.";
  } else if (input === emailInput &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = "Please enter a valid email address.";
  } else if (input === messageInput && value.length < 10) {
    message = "Please enter at least 10 characters.";
  }

  errorElement.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

// Update the character counter with the input event.
messageInput.addEventListener("input", () => {
  characterCount.textContent = `${messageInput.value.length} / 500`;
  const messageField = fields.find((field) => field.input === messageInput);
  if (messageInput.value.length > 0) {
    validateField(messageField.input, messageField.error);
  }
});

// Validate fields as the user leaves them.
fields.forEach(({ input, error }) => {
  input.addEventListener("blur", () => {
    if (input.value.trim() !== "") validateField(input, error);
  });
  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) validateField(input, error);
  });
});

// Handle form submission without refreshing the page.
feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isFormValid = fields
    .map(({ input, error }) => validateField(input, error))
    .every(Boolean);

  formFeedback.hidden = false;

  if (!isFormValid) {
    formFeedback.className = "form-feedback error";
    formFeedback.textContent = "Please fix the highlighted fields before submitting.";
    const firstInvalidField = fields.find(({ input }) => input.classList.contains("invalid"));
    firstInvalidField?.input.focus();
    return;
  }

  const submittedName = nameInput.value.trim();
  const submittedTopic = topicInput.value;

  formFeedback.className = "form-feedback success";
  formFeedback.textContent =
    `Thanks, ${submittedName}! Your "${submittedTopic}" feedback has been processed successfully. (Demo only — nothing was sent to a server.)`;

  feedbackForm.reset();
  characterCount.textContent = "0 / 500";
  fields.forEach(({ input, error }) => {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    error.textContent = "";
  });
});

// Load products as soon as the page is ready.
loadProducts();
