require("dotenv").config();

const apiKey = process.env.API_KEY;
document.addEventListener("DOMContentLoaded", getProducts);
const productsContainer = document.getElementById("productsContainer");
const cartContainer = document.getElementById("cartContainer");
const overlay = document.getElementById("overlay");

const searchInput = document.getElementById("searchInput");
const cartCount = document.querySelector(".cart-count");
const cartButton = document.querySelector(".icon-cart");
const cartPopup = document.querySelector(".cart-popup");
const closeCartButton = document.querySelector(".close-cart");
let productsDisplayed = [];
let cart = {};

searchInput.addEventListener("input", searchProducts);
cartButton.addEventListener("click", toggleCartPopup);

async function getProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    productsDisplayed = data;
    displayProducts(productsDisplayed);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = ""; // Clear previous content

  products.forEach((product) => {
    const productElement = createProductElement(product);
    productsContainer.appendChild(productElement);
  });
}

function createProductElement(product) {
  const productElement = document.createElement("div");
  productElement.classList.add("product");

  const imageElement = document.createElement("img");
  imageElement.src = product.image;
  imageElement.alt = product.title;

  const nameElement = document.createElement("h3");
  nameElement.textContent = product.title;

  const priceElement = document.createElement("p");
  priceElement.textContent = `Price: $${product.price}`;

  const addToCartButtonElement = document.createElement("button");
  addToCartButtonElement.textContent = "Add to Cart";
  addToCartButtonElement.addEventListener("click", () => addToCart(product));

  productElement.appendChild(imageElement);
  productElement.appendChild(nameElement);
  productElement.appendChild(priceElement);
  productElement.appendChild(addToCartButtonElement);

  return productElement;
}

function toggleCartPopup() {
  cartPopup.classList.toggle("show");
  overlay.classList.toggle("show");
  if (cartPopup.classList.contains("show")) {
    renderCart(); // Render cart items when popup is shown
  }
}

closeCartButton.addEventListener("click", toggleCartPopup);
overlay.addEventListener("click", toggleCartPopup);

function searchProducts(e) {
  const filteredProducts = productsDisplayed.filter((product) =>
    product.title.toLowerCase().includes(e.target.value.toLowerCase())
  );
  displayProducts(filteredProducts);
}

function addToCart(product) {
  if (cart[product.id]) {
    cart[product.id].quantity++;
    cart[product.id].totalPrice = cart[product.id].quantity * product.price;
  } else {
    cart[product.id] = { ...product, quantity: 1, totalPrice: product.price };
  }
  updateCartCount();
}

function updateCartCount() {
  const totalCount = Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0
  );
  cartCount.textContent = totalCount;
}

function renderCart() {
  cartContainer.innerHTML = ""; // Clear previous content

  Object.values(cart).forEach((item) => {
    const cartItemElement = createCartItemElement(item);
    cartContainer.appendChild(cartItemElement);
  });
}

function createCartItemElement(item) {
  const cartItemElement = document.createElement("div");
  cartItemElement.classList.add("cart-item");

  const namePriceWrapper = document.createElement("div");
  namePriceWrapper.classList.add("name-price-wrapper");

  const nameElement = document.createElement("p");
  nameElement.textContent = item.title;

  const priceElement = document.createElement("p");
  priceElement.textContent = `Price: $${item.totalPrice}`;

  const quantityElement = document.createElement("span");
  quantityElement.textContent = `Quantity: ${item.quantity}`;

  const removeButtonElement = document.createElement("button");
  removeButtonElement.textContent = "Remove";
  removeButtonElement.addEventListener("click", () => removeCartItem(item.id));

  namePriceWrapper.appendChild(nameElement);
  namePriceWrapper.appendChild(priceElement);

  cartItemElement.appendChild(namePriceWrapper);
  cartItemElement.appendChild(quantityElement);
  cartItemElement.appendChild(removeButtonElement);

  return cartItemElement;
}

function removeCartItem(productId) {
  if (cart[productId]) {
    cart[productId].quantity--;
    cart[productId].totalPrice -= cart[productId].price;
    if (cart[productId].quantity <= 0) {
      delete cart[productId];
    }
    updateCartCount();
    renderCart();
  }
}

const modeToggle = document.getElementById("modeToggle");

modeToggle.addEventListener("click", toggleMode);

function toggleMode() {
  document.body.classList.toggle("dark-mode");
}
