let shop = document.getElementById("shop");
let ShoppingCart = document.getElementById("shopping-cart");
let label = document.getElementById("label");
let basket = JSON.parse(localStorage.getItem("data")) || [];
let shopItemsData = [];

fetch("http://localhost:3000/Laptops") 
  .then((response) => response.json())
  .then((data) => {
    shopItemsData = data;
    generateShop(); 
    generateCartItems();
    calculation();
    TotalAmount();
  })
  .catch((error) => console.error("Error fetching data:", error));

let generateShop = () => {
  if (!shopItemsData.length) return;
  
  shop.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, desc, img, price } = x;
      let search = basket.find((y) => y.id === id) || [];
      return `
        <div id=product-id-${id} class="item">
          <img width="220" src=${img} alt="">
          <div class="details">
            <h3>${name}</h3>
            <p>${desc}</p>
            <div class="price-quantity">
              <h2>Ksh ${price} </h2>
              <div class="buttons">
                <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
                <div id=${id} class="quantity">${search.item === undefined ? 0 : search.item}</div>
                <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
};

let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((x) => x.id === id) || [];
        let { img, price, name } = search;
        return `
      <div class="cart-item">
        <img width="100" src=${img} alt="" />
        <div class="details">
          <div class="title-price-x">
            <h4 class="title-price">
              <p>${name}</p>
              <p class="cart-item-price">Ksh ${price}</p>
            </h4>
            <i onclick="removeItem('${id}')" class="bi bi-x-lg"></i>
          </div>
          <div class="cart-buttons">
            <div class="buttons">
              <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${item}</div>
              <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
            </div>
          </div>
          <h3>Ksh ${item * price}</h3>
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = "";
    label.innerHTML = `
    <h2>Cart is Empty</h2>
    <a href="index.html">
      <button class="HomeBtn">Back to Home</button>
    </a>
    `;
  }
};

let increment = (id) => {
  let search = basket.find((x) => x.id === id);
  if (search === undefined) {
    basket.push({ id: id, item: 1 });
  } else {
    search.item += 1;
  }
  update(id);
  localStorage.setItem("data", JSON.stringify(basket));
  generateCartItems();
};

let decrement = (id) => {
  let search = basket.find((x) => x.id === id);
  if (!search) return;
  if (search.item === 0) return;
  search.item -= 1;
  update(id);
  basket = basket.filter((x) => x.item !== 0);
  localStorage.setItem("data", JSON.stringify(basket));
  generateCartItems();
};

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search ? search.item : 0;
  calculation();
  TotalAmount();
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0) || 0;
};

let removeItem = (id) => {
  basket = basket.filter((x) => x.id !== id);
  calculation();
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { id, item } = x;
        let filterData = shopItemsData.find((x) => x.id === id);
        return filterData.price * item;
      })
      .reduce((x, y) => x + y, 0);

    label.innerHTML = `
    <h2>Total Bill : Ksh ${amount}</h2>
    <button class="checkout">Checkout</button>
    <button onclick="clearCart()" class="removeAll">Clear Cart</button>
    `;
  }
};

let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};