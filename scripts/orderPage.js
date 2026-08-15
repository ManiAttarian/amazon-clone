import { orders } from "../data/orders.js";
import { getProduct, products, loadProductsFetch } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import formatCurrency from "./utils/money.js";
import { addToCart, addToCartOne } from "../data/cart.js";
import { renderHeader, searchProduct } from "./header.js";

console.log(orders);

async function loadPage() {
  await loadProductsFetch();

  let ordersHTML = "";

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format("MMMM D");

    ordersHTML += `
    <div class="order-container">
        <div class="order-header">
            <div class="order-header-left-section">
                <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${orderTimeString}</div>
                </div>
                <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${formatCurrency(order.totalCostCents)}</div>
                </div>
            </div>

            <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
            </div>
        </div>

        <div class="order-details-grid">
            ${productsListHTML(order)}
        </div>
    </div>
    `;
  });

  function productsListHTML(order) {
    let productsListHTML = "";

    order.products.forEach((productDetail) => {
      const product = getProduct(productDetail.productId);

      productsListHTML += `
        <div class="product-image-container">
            <img src="${product.image}" />
        </div>

        <div class="product-details">
            <div class="product-name">
                ${product.name}
            </div>
            <div class="product-delivery-date">Arriving on: ${dayjs(productDetail.estimatedDeliveryTime).format("MMMM D")}</div>
            <div class="product-quantity">Quantity: ${productDetail.quantity}</div>
            <button class="buy-again-button button-primary js-add-to-cart" ${productDetail.productId}>
                <img class="buy-again-icon" src="images/icons/buy-again.png" />
                <span class="buy-again-message " data-product-id=>Buy it again</span>
            </button>
        </div>

        <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${productDetail.productId}">
                <button class="track-package-button button-secondary">
                    Track package
                </button>
            </a>
        </div>`;
    });

    return productsListHTML;
  }

  document.querySelector(".js-orders-grid").innerHTML = ordersHTML;

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;

      addToCartOne(productId);

      button.innerHTML = "Added";
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);

      renderHeader();
    });
  });
   searchProduct();
}

renderHeader();
loadPage();
