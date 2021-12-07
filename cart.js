// Array med alla produkter
const products = [
    { id: 1, title: "Minecraft 2", description: "New and improved", price: 2 },
    { id: 2, title: "ActivatingHawkeye - domain", description: "One of the greatest websites out there currently! And it's yours for the low-low price of tree-fiddy", price: 3.50 },
    { id: 3, title: "Gustavs basker", description: "Headwear for all your cold December needs", price: 68 },
];

// Hjälpfunktion som tar fram ett unikt "customer ID" från localstorage om det finns
// Annars genereras ett nytt.
// Prova att öppna sidan i incognitomode och se att du får ett nytt varje gång.
function getCustomerId() {
    let customerId = localStorage.getItem("customerid");

    if (customerId === null) {
        customerId = Math.floor(Math.random() * 1000000000) + 1000000000;
        localStorage.setItem("customerid", customerId);
        localStorage.setItem("cart", "");
    }

    return customerId;
}

// Funktion som lägger till produkt med ett visst ID till localstorage
function addToCart(id) {
    for (let product of products) {
        if (product.id === id) {
            localStorage.setItem("cart", localStorage.getItem("cart") + id + ",")
        }
    }
}

// Returnerar varukorgens innehåll uppdelad i en array
function getCart() {
    return localStorage.getItem("cart").trim(",").split(",");
}

// Funktion som ritar upp alla produkter (se arrayen högst upp)
// till div med klassen container
function displayProducts() {
    let container = document.querySelector(".container");

    for (let product of products) {
        container.innerHTML +=
            `<div class="item">` +
            `<h2>${product.title}</h2>` +
            `<p>${product.description}</p>` +
            `<p>Price: <b>${product.price}:-</b></p>` +
            `<button onclick="addToCart(${product.id})">BUY</button>`;
    }
}

// Funktion som ritar upp innehållet i varukorgen till div
// med klass cartcontainer
function displayCart() {
    let container = document.querySelector(".cartcontainer");

    let cart = getCart();

    let totalPrice = 0;

    for (let id of cart) {
        for (let product of products) {
            if (product.id == id) {
                container.innerHTML +=
                    `<div class="cartitem">` +
                    `<p><b>${product.title}</b>: ${product.price}:-</p>` +
                    `</div>`;

                totalPrice += product.price;
            }
        }
    }

    container.innerHTML +=
        `<div class="cartitem">` +
        `<p><b>Total</b>: ${totalPrice}:-</p>` +
        `</div>`;
}

function paymentOption(x) {

    if (x == 1) {
        document.querySelector("#cc").classList.remove("hide");
        document.querySelector("#swish").classList.add("hide");
    } else {
        document.querySelector("#cc").classList.add("hide");
        document.querySelector("#swish").classList.remove("hide");
    }
}

function validateForm() {
    let firstName = document.querySelector("#firstName").value;
    document.querySelector("#paymentHeader").innerText += firstName;
    localStorage.setItem("firstName", firstName);
}
// Se alltid till att försöka hitta customerID på varje sida
getCustomerId();