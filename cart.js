// Array med alla produkter
const products = [
    { id: 1, title: "Minecraft 2", description: "New and improved", price: 2 },
    { id: 2, title: "Gustavs basker", description: "Headwear for all your cold December needs", price: 68 },
    { id: 3, title: "ActivatingHawkeye - domain", description: "One of the greatest websites out there currently! And it's yours for the low-low price of tree-fiddy", price: 3.50 },
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
            localStorage.setItem("cart", localStorage.getItem("cart") + id + ",");
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
                    `</div><hr>`;

                totalPrice += product.price;
            }
        }
    }

    container.innerHTML +=
        `<div class="cartitem">` +
        `<p><b>Total</b>: ${totalPrice}:-</p>` +
        `</div>`;
}

function paymentOption(x) { // switches between the two payment alternatives 

    if (x == 1) {
        document.querySelector("#cc").classList.remove("hide");
        document.querySelector("#swish").classList.add("hide");
        localStorage.setItem("credit", "ja");
        localStorage.setItem("swish", "nej");
    } else {
        document.querySelector("#cc").classList.add("hide");
        document.querySelector("#swish").classList.remove("hide");
        localStorage.setItem("swish", "ja");
        localStorage.setItem("credit", "nej");
    }
}

function formSubmit() { // user can't go to payment or checkout_2.html unless the cart has items
    if (localStorage.getItem("cart") == 0 || localStorage.getItem("cart") == null) {
        alert("You can't proceed with an empty cart");
        return false;
    } else {
        let firstName = document.querySelector("#firstName").value;
        localStorage.setItem("firstName", firstName);
        let lastName = document.querySelector("#lastName").value;
        localStorage.setItem("lastName", lastName);
        let email = document.querySelector("#email").value;
        localStorage.setItem("email", email);
        let address = document.querySelector("#address").value;
        localStorage.setItem("address", address);
        let zipcode = document.querySelector("#zipcode").value;
        localStorage.setItem("zipcode", zipcode);
        return true;
    }
}

function printUsersName() { // displays users inputed name on the next page 
    document.getElementById("paymentHeader").innerHTML = localStorage.getItem("firstName") + ", please choose a payment method";
}

function validateForm() { // Check if the card has expired or not
    yearToday = new Date().getFullYear();
    monthToday = new Date().getMonth() + 1;
    let expYear = document.querySelector("#year").value;
    let expMonth = document.querySelector("#month").value;

    expYear = parseInt("20" + expYear);

    if (expMonth < 10) {
        expMonth = parseInt(expMonth.substr(1, expMonth.length));
    }

    if (expYear <= yearToday) {
        if (expMonth < monthToday) {
            alert("Your card has expired, try with another card");
            return false;
        }
    }
    alert("Valid card, proceed"); // issue here, it doesnt take me to the thankyou.html unless I return false. This is not correct and should be done differently
    window.location.href = ("thankyou.html");
    return false;
}

function swishPay() { // if the user correctly inputs a phone number, shows the swish picture
    document.querySelector("#swishCheckout").classList.toggle("hide");
    let phone = document.querySelector("#phone").value;
    localStorage.setItem("phone", phone);
    return false; // used because we are not actually sending anything anyway and dont want the page to reload

}

function removeItems() { // removes all items in the cart and refreshes the div with the items inside it

    localStorage.removeItem("cart");
    let refresh = document.querySelector(".cartcontainer");
    refresh.innerHTML = `<div class="cartitem">` +
        `<p><b>Total</b>: 0:-</p>` +
        `</div>`
}

function thankYou() { // thank you page text
    document.querySelector("#thanks").innerText = "Thank you for your order, " + localStorage.getItem("firstName") +
        " " + localStorage.getItem("lastName") + "!";
    document.querySelector("#shipment").innerHTML = "We will be shipping it to your address: " + localStorage.getItem("address");
    document.querySelector("#receipt").innerText = "Your receipt can be found on your email address " + localStorage.getItem("email");
}


// Se alltid till att försöka hitta customerID på varje sida
getCustomerId();


/* 
Jag testade min hemsida på en äldre version av Mozilla Firefox, version 38.0 för att vara exakt. Där stöter jag på problem direkt.
Webbläsaren kastar Syntax-errors samt Reference-errors på mig. Syntax-errorsen den menar på finns är avsaknaden av semikolon, även om det finns semikolon på de platser
som webbläsaren hänvisar till. 

Reference-errorsen säger att funktionerna i scriptet inte är definierade. Jag sökte runt lite på nätet och kom inte egentligen fram till något
konkret om varför. HTML samt den lilla CSS som finns fungerar, men som sagt inga funktioner. Jag försökte debugga i devtoolsen och
blev fundersam om mitt script över huvud taget lästes in, för jag kunde inte hitta det någonstans i webbläsaren. Det tillsammans med det faktum att
de enda funktionerna som det klagades på i konsolen var dem som låg i <script>-taggar eller dem som var kopplade till en knapp. Det ledde mig att tro
att webbläsaren gjorde så gott den kunde, men när funktionerna blev kallade så fanns inga referenser till dem.
*/