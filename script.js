const menuItems = [
  {
    id: 1,
    name: "Burger",
    price: 69,
    discount: 20,
    image: "./assets/burger.png",
  },
  {
    id: 2,
    name: "Pizza",
    price: 249,
    discount: 50,
    image: "./assets/pizza.png",
  },
  {
    id: 3,
    name: "Chilli Potato",
    price: 79,
    discount: 10,
    image: "./assets/chillie_potato.png",
  },
  {
    id: 4,
    name: "Chowmein",
    price: 59,
    discount: 40,
    image: "./assets/chowmine.png",
  },
  {
    id: 5,
    name: "Fried Rice",
    price: 59,
    discount: 50,
    image: "./assets/fried rice.png",
  },
  { id: 6, name: "Samosa", price: 14, discount: 5, image: "./assets/samosa.png" },
  { id: 7, name: "Maggi", price: 29, discount: 10, image: "./assets/maggi.png" },
  { id: 8, name: "White Sauce Pasta", price: 79, discount: 10, image: "./assets/white_sauce_pasta.png" },
  { id: 9, name: "Momo", price: 19, discount: 0, image: "./assets/momos.png" },
];

const menuContainer = document.getElementById("menu");
const cartItemsContainer = document.getElementById("cart-items");
const totalCostElement = document.getElementById("total-cost");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentIndex = 0;

function renderMenu() {
  menuContainer.innerHTML = "";
  const visibleItems = menuItems.slice(currentIndex, currentIndex + 4);
  visibleItems.forEach((item) => {
    const menuItemDiv = document.createElement("div");
    menuItemDiv.className = "menu-item";

    const finalPrice = item.price - item.discount;
    let priceHTML = `<p>₹${finalPrice}`;
    if (item.discount > 0) {
      priceHTML = `
						<p>
							<span style="text-decoration: line-through;">₹${item.price}</span>
							₹${finalPrice}
						</p>
					`;
    }

    menuItemDiv.innerHTML = `
					<img src="${item.image}" alt="${item.name}">
					<h3>${item.name}</h3>
					${priceHTML}
					<button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
				`;

    menuContainer.appendChild(menuItemDiv);
  });
}

leftArrow.addEventListener("click", () => {
  if (currentIndex === 0) {
    return; // Do nothing if we're already at the first set of items
  } else {
    currentIndex -= 4;
  }
  renderMenu();
  updateArrows();
});

rightArrow.addEventListener("click", () => {
  if (currentIndex + 4 >= menuItems.length) {
    return; // Do nothing if we're already at the last set of items
  } else {
    currentIndex += 4;
  }
  renderMenu();
  updateArrows();
});

function updateArrows() {
  if (currentIndex === 0) {
    leftArrow.disabled = true;
  } else {
    leftArrow.disabled = false;
  }

  if (currentIndex + 4 >= menuItems.length) {
    rightArrow.disabled = true;
  } else {
    rightArrow.disabled = false;
  }
}

menuContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const itemId = parseInt(e.target.getAttribute("data-id"));
    const item = menuItems.find((menuItem) => menuItem.id === itemId);

    const cartItem = cart.find((cartEntry) => cartEntry.id === itemId);

    if (cartItem) {
      cartItem.quantity++;
      cartItem.totalPrice = cartItem.quantity * (item.price - item.discount);
    } else {
      cart.push({
        ...item,
        quantity: 1,
        totalPrice: item.price - item.discount,
      });
    }

    updateCart();
    saveCartToLocalStorage();
  }
});

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const itemId = parseInt(e.target.getAttribute("data-id"));
    const cartItem = cart.find((cartEntry) => cartEntry.id === itemId);

    if (cartItem) {
      cartItem.quantity--;
      cartItem.totalPrice =
        cartItem.quantity * (cartItem.price - cartItem.discount);

      if (cartItem.quantity === 0) {
        const index = cart.findIndex((cartEntry) => cartEntry.id === itemId);
        cart.splice(index, 1);
      }
    }

    updateCart();
    saveCartToLocalStorage();
  }
});

function updateCart() {
  cartItemsContainer.innerHTML = "";
  let totalCost = 0;

  cart.forEach((cartItem) => {
    totalCost += cartItem.totalPrice;
    const cartElement = document.createElement("li");
    cartElement.innerHTML = `
					${cartItem.name} x${cartItem.quantity} - ₹${cartItem.totalPrice}
					<button class="remove-item" data-id="${cartItem.id}">-</button>
				`;
    cartItemsContainer.appendChild(cartElement);
  });

  totalCostElement.textContent = `Total: ₹${totalCost}`;
}

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart on page load
renderMenu();
updateArrows();
updateCart();
