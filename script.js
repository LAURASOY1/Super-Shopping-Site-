document.addEventListener("DOMContentLoaded", getProducts);
const productsContainer = document.getElementById("productsContainer");

const searchInput = document.getElementById("searchInput");
const cartCount = document.querySelector(".icon-cart span");
const cartButton = document.querySelector(".icon-cart");
const cartPopup = document.querySelector(".cart-popup");
const closeCartButton = document.querySelector(".close-cart");
let productsDisplayed = [];
let allProducts = [];
let cart = {};
searchInput.addEventListener("input", searchProducts);
cartButton.addEventListener("click", renderCart);
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

function onLoad() {
  // set cart from state after load
  cart = history.state || {};
}

function onCartChanged(updatedCart) {
  // push state in history whenever cart is changed
  history.pushState(updatedCart, "cart");
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

// Function to toggle cart popup visibility
function toggleCartPopup() {
  cartPopup.classList.toggle("show");
}

// Event listener for cart button click
cartButton.addEventListener("click", toggleCartPopup);

// Event listener for close cart button click
closeCartButton.addEventListener("click", toggleCartPopup);

function searchProducts(e) {
  const filteredProducts = productsDisplayed.filter((product) =>
    product.title.toLowerCase().includes(e.target.value.toLowerCase())
  );
  displayProducts(filteredProducts);
}
function createCartItemElement(item) {
  const cartItemElement = document.createElement("div");
  cartItemElement.classList.add("cart-item");

  const namePriceWrapper = document.createElement("div");
  namePriceWrapper.classList.add("name-price-wrapper");

  const nameElement = document.createElement("p");
  nameElement.textContent = item.title;

  const priceElement = document.createElement("p");
  priceElement.textContent = `Price: $${item.price}`;

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

function addToCart(product) {
  if (cart[product.id]) {
    cart[product.id].quantity++;
  } else {
    cart[product.id] = { ...product, quantity: 1 };
  }
  updateCartCount();
  renderCart();
}

function removeCartItem(productId) {
  if (cart[productId]) {
    cart[productId].quantity--;
    if (cart[productId].quantity <= 0) {
      delete cart[productId];
    }
    updateCartCount();
    renderCart();
  }
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

const modeToggle = document.getElementById("modeToggle");

modeToggle.addEventListener("click", toggleMode);

function toggleMode() {
  document.body.classList.toggle("dark-mode");
}