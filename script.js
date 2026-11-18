const productImages = [
  "images/image-product-1.jpg",
  "images/image-product-2.jpg",
  "images/image-product-3.jpg",
  "images/image-product-4.jpg"
];

const product = {
  name: "Fall Limited Edition Sneakers",
  price: 125,
  image: productImages[0]
};

const mainImage = document.querySelector("#main-image");
const lightboxImage = document.querySelector("#lightbox-image");
const thumbnailLists = document.querySelectorAll(".thumbnail-list");
const quantityOutput = document.querySelector("#quantity-value");
const cartCount = document.querySelector("#cart-count");
const cartPanel = document.querySelector("#cart-panel");
const cartContent = document.querySelector("#cart-content");
const cartToggle = document.querySelector("#cart-toggle");
const lightbox = document.querySelector("#lightbox");
const menu = document.querySelector("#mobile-menu");
const menuToggle = document.querySelector("#menu-toggle");
const menuClose = document.querySelector("#menu-close");
const menuBackdrop = document.querySelector("#mobile-menu-backdrop");

let selectedImage = 0;
let quantity = 0;
let cartQuantity = 0;
let lastFocusedElement = null;

function updateGallery(index) {
  selectedImage = (index + productImages.length) % productImages.length;
  mainImage.src = productImages[selectedImage];
  lightboxImage.src = productImages[selectedImage];

  thumbnailLists.forEach((list) => {
    list.querySelectorAll(".thumbnail").forEach((thumbnail) => {
      const isActive = Number(thumbnail.dataset.image) === selectedImage;
      thumbnail.classList.toggle("is-active", isActive);
      thumbnail.setAttribute("aria-pressed", String(isActive));
    });
  });
}

function changeQuantity(amount) {
  quantity = Math.max(0, quantity + amount);
  quantityOutput.textContent = quantity;
}

function updateCart() {
  cartCount.textContent = cartQuantity;
  cartCount.hidden = cartQuantity === 0;

  if (cartQuantity === 0) {
    cartContent.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  const total = (product.price * cartQuantity).toFixed(2);
  cartContent.innerHTML = `
    <div class="cart-item">
      <img class="cart-item-image" src="${product.image}" alt="">
      <div class="cart-item-details">
        <p>${product.name}</p>
        <p>$${product.price.toFixed(2)} × ${cartQuantity}<strong class="cart-item-total">$${total}</strong></p>
      </div>
      <button class="remove-item" id="remove-item" type="button" aria-label="Remove sneakers from cart">
        <img src="images/icon-delete.svg" alt="">
      </button>
    </div>
    <button class="checkout-button" type="button" id="checkout-button">Checkout</button>
  `;

  document.querySelector("#remove-item").addEventListener("click", () => {
    cartQuantity = 0;
    updateCart();
  });

  document.querySelector("#checkout-button").addEventListener("click", () => {
    alert("Thanks for your interest! Checkout is not available in this demo.");
  });
}

function toggleCart(forceState) {
  const shouldOpen = typeof forceState === "boolean" ? forceState : cartPanel.hidden;
  cartPanel.hidden = !shouldOpen;
  cartToggle.setAttribute("aria-expanded", String(shouldOpen));
}

function openMenu() {
  menu.classList.add("is-open");
  menu.classList.remove("is-closing");
  menu.removeAttribute("inert");
  menu.setAttribute("aria-hidden", "false");
  menuBackdrop.hidden = false;
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation");
  lastFocusedElement = document.activeElement;
  menuClose.focus();
}

function closeMenu() {
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
  menu.setAttribute("inert", "");
  menuBackdrop.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  if (lastFocusedElement) lastFocusedElement.focus();
}

function openLightbox() {
  if (window.matchMedia("(max-width: 650px)").matches) return;
  lightbox.hidden = false;
  document.body.classList.add("modal-open");
  lastFocusedElement = document.activeElement;
  document.querySelector("#lightbox-close").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

thumbnailLists.forEach((list) => {
  list.addEventListener("click", (event) => {
    const thumbnail = event.target.closest(".thumbnail");
    if (!thumbnail) return;
    updateGallery(Number(thumbnail.dataset.image));
  });
});

document.querySelector("#quantity-decrease").addEventListener("click", () => changeQuantity(-1));
document.querySelector("#quantity-increase").addEventListener("click", () => changeQuantity(1));

document.querySelector("#add-to-cart").addEventListener("click", () => {
  if (quantity === 0) {
    quantityOutput.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }],
      { duration: 220 }
    );
    return;
  }

  cartQuantity += quantity;
  quantity = 0;
  quantityOutput.textContent = quantity;
  updateCart();
  toggleCart(true);
});

cartToggle.addEventListener("click", () => toggleCart());

document.addEventListener("click", (event) => {
  if (!cartPanel.hidden && !event.target.closest(".cart-wrapper")) {
    toggleCart(false);
  }
});

menuToggle.addEventListener("click", () => {
  if (menu.classList.contains("is-open")) closeMenu();
  else openMenu();
});
menuClose.addEventListener("click", closeMenu);
menuBackdrop.addEventListener("click", closeMenu);
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelector("#main-image-button").addEventListener("click", openLightbox);
document.querySelector("#lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.querySelector("#mobile-previous").addEventListener("click", () => updateGallery(selectedImage - 1));
document.querySelector("#mobile-next").addEventListener("click", () => updateGallery(selectedImage + 1));
document.querySelector("#lightbox-previous").addEventListener("click", () => updateGallery(selectedImage - 1));
document.querySelector("#lightbox-next").addEventListener("click", () => updateGallery(selectedImage + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!lightbox.hidden) closeLightbox();
    if (menu.classList.contains("is-open")) closeMenu();
    toggleCart(false);
  }

  if (!lightbox.hidden && event.key === "ArrowRight") updateGallery(selectedImage + 1);
  if (!lightbox.hidden && event.key === "ArrowLeft") updateGallery(selectedImage - 1);
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(max-width: 650px)").matches && !lightbox.hidden) {
    closeLightbox();
  }
});

updateGallery(0);
updateCart();
