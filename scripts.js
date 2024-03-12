// import './types.js'

const openingHoursSpan = document.getElementById("opening-hours-span");
const menu = document.getElementById("menu");
const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutButton = document.getElementById("checkout-button");
const closeModalButton = document.getElementById("close-modal-button");
const addressInput = document.getElementById("address-input");
const addressWarning = document.getElementById("address-warning");

/**
 * @type {CartItem[]}
 */
let cart = [];

cartButton.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

closeModalButton.addEventListener("click", () => {
  cartModal.style.display = "none";
});

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-cart-button");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = Number(parentButton.getAttribute("data-price"));

    addToCart({ name, price });
  }
});

/**
 * @param {IncomingItem} item
 * @returns {void}
 */

function addToCart({ name, price }) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "flex-col", "space-between", "pb-4");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
          <strong class="font-medium">${item.name}</strong>
          <span>(Quantidade: ${item.quantity})</span>
          <span>R$ ${item.price.toFixed(2)}</span>
        </div>
        <button class="remove-from-cart-button" data-name="${item.name}">
          Remover
        </button>
      </div>
    `;
    total += item.price * item.quantity;

    cartItems.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerHTML = cart.length;
}

cartItems.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".remove-from-cart-button");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    removeItemFromCart({ name });
  }
});

/**
 * @param {OncomingItem} item
 * @returns {void}
 */

function removeItemFromCart({ name }) {
  const itemIndex = cart.findIndex((item) => item.name === name);

  if (itemIndex > -1) {
    const item = cart[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
  }

  updateCartModal();
}

addressInput.addEventListener("input", (event) => {
  let address = event.target.value;
  const hasAddress = address !== "";

  if (hasAddress) {
    addressWarning.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

checkoutButton.addEventListener("click", () => {
  const isCartEmpty = cart.length === 0;

  if (!isRestaurantOpen) {
    Toastify({
      text: "RESTAURANTE FECHADO NO MOMENTO - Horário de funcionamento: 18h às 22h",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (isCartEmpty) return;
  if (!addressInput.value) {
    addressWarning.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
  }

  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${
        item.quantity
      }) Preço: R$ ${item.price.toFixed(2)}) | `;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "84991224132";

  window.open(
    `https://wa.me/${phone}?text=Olá, gostaria de fazer um pedido com os seguintes itens: ${message}, para o endereço: ${addressInput.value}`,
    "_blank"
  );

  cart = [];
  updateCartModal();
});

function checkRestaurantOpen() {
  const date = new Date();
  const hour = date.getHours();
  const isRestaurantOpen = hour >= 18 && hour <= 22;

  return isRestaurantOpen;
}

const isRestaurantOpen = checkRestaurantOpen();

if (isRestaurantOpen) {
  openingHoursSpan.classList.remove("bg-red-500");
  openingHoursSpan.classList.add("bg-green-600");
} else {
  openingHoursSpan.classList.remove("bg-green-600");
  openingHoursSpan.classList.add("bg-red-500");
}
