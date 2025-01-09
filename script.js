const menuItems = [
  {
    id: 1,
    name: "Burger",
    price: 69,
    discount: 20,
    image: "https://www.thespruceeats.com/thmb/tXNCjluH-GTBfd7Sd4iChDt34-4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/SES-your-best-grilled-burger-recipe-7511041-hero-C-c5080fa5f97c4c2b908968527f8a851b.jpg",
  },
  {
    id: 2,
    name: "Pizza",
    price: 249,
    discount: 50,
    image: "https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067",
  },
  {
    id: 3,
    name: "Chilli Potato",
    price: 79,
    discount: 10,
    image: "https://static.toiimg.com/thumb/52532656.cms?imgsize=498654&width=509&height=340",
  },
  {
    id: 4,
    name: "Chowmein",
    price: 59,
    discount: 40,
    image: "https://efcchakia.com/admin-panel/images/product/15-07-2021/Paneer-Chowmine.jpg",
  },
  {
    id: 5,
    name: "Fried Rice",
    price: 59,
    discount: 50,
    image: "https://slurrp.club/wp-content/uploads/2022/04/DSC_0288-2-2.jpg",
  },
  { id: 6, name: "Samosa", price: 14, discount: 5, image: "https://www.cookwithnabeela.com/wp-content/uploads/2024/02/AlooSamosa3.webp" },
  { id: 7, name: "Maggi", price: 29, discount: 10, image: "https://as1.ftcdn.net/v2/jpg/09/89/53/44/1000_F_989534464_KXLsywDiA3LOjUIsmYInuSfeYz1eoKjG.jpg" },
  { id: 8, name: "White Sauce Pasta", price: 79, discount: 10, image: "https://www.indianveggiedelight.com/wp-content/uploads/2023/01/white-sauce-pasta.jpg" },
  { id: 9, name: "Momo", price: 19, discount: 0, image: "https://i0.wp.com/passion2cook.com/wp-content/uploads/2023/03/paneer-momos-1.jpg" },
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
