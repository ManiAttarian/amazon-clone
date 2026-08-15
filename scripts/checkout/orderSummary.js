import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";

import { products, getProduct } from "../../data/products.js";

import formatCurrency from "../utils/money.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";

import { renderPaymentSummary } from "./paymentSummary.js";

import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary() {
  const orderSummaryElement = document.querySelector(".js-order-summary");

  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const { productId, deliveryOptionId } = cartItem;

    const matchingProduct = getProduct(productId);

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">Delivery date: ${dateString}</div>

        <div class="cart-item-details-grid">
            <img
            class="product-image"
            src="${matchingProduct.image}"
            />

            <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
            <div class="product-price">${matchingProduct.getPrice()}</div>
                <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                    <span> Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span> </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                    Update
                    </span>
                    <input type="number" class="quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" 
                    data-product-id="${matchingProduct.id}">
                    Delete
                    </span>
                </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
        </div>
    </div>

  `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += ` 
    <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
      <input
      ${isChecked ? "checked" : ""}
      type="radio"
      class="delivery-option-input"
      name="delivery-option-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">${priceString} Shipping</div>
      </div>
    </div>

    `;
    });

    return html;
  }

  orderSummaryElement.innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const { productId } = deleteButton.dataset;
      removeFromCart(productId);

      renderOrderSummary();

      renderPaymentSummary();

      renderCheckoutHeader();
    });
  });

  document
    .querySelectorAll(".js-update-quantity-link")
    .forEach((updateButton) => {
      updateButton.addEventListener("click", () => {
        const { productId } = updateButton.dataset;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`,
        );

        container.classList.add("is-editing-quantity");
      });
    });

  document.querySelectorAll(".js-save-quantity-link").forEach((saveLink) => {
    saveLink.addEventListener("click", () => {
      const { productId } = saveLink.dataset;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );

      container.classList.remove("is-editing-quantity");

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`,
      );

      const newQuantity = Number(quantityInput.value);
      if (newQuantity <= 0) return;
      updateQuantity(productId, newQuantity);

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`,
      );

      quantityLabel.innerHTML = newQuantity;

      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
