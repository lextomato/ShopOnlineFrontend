// <--- FUNCTIONS --->

// Function that replaces fallen images
function imgError(image) {
    image.onerror = "";
    image.src = "assets/imgError.jpg";
    return true;
}
// End.

// Function that brings elements filtered by search from the server
function searching(id, key){
    const API_URL = 'http://localhost:8000';
    let dataSearch = document.getElementsByName('search')[0].value;
    let ext_URL = `/api/search/?ordering=${key}&search=${dataSearch}`;
    let data = null;
    const HTMLResponse = document.querySelector("#products");
    const HTMLResponseChild = document.querySelector("#filter");
    const HTMLNoResults = document.querySelector("#noResults");

    // remove existing content to replace it with the search
    if (HTMLNoResults) {
        HTMLResponse.removeChild(HTMLNoResults);
    }
    if (HTMLResponseChild) {
        HTMLResponse.removeChild(HTMLResponseChild);
    }
    // .
    data = fetchNow(ext_URL, API_URL); // request for filtered items
    paintHTML(data, id); // paint html with new elements
    }
// End.

// Function to request data to the REST API, by Fecth request
function fetchNow(ext_URL, API_URL){
    let data = fetch(`${API_URL}${ext_URL}`)
        .then((response) => response.json())
    return data;
}
// End.

// Function to paint HTML with the products
function paintHTML(data, id) {
    // update spinner quantity of products, visible
    const spinner = document.querySelector('#spinner');
    const HTMLproducts = document.querySelector('#products');
    spinner.setAttribute('class', 'd-flex justify-content-center');
    HTMLproducts.setAttribute('class', 'd-none');
    // End.

    let ul = document.createElement('ul');
    ul.setAttribute('class', 'pagination justify-content-end');
    ul.setAttribute('id', 'paginate');

    const HTMLResponseProducts = document.querySelector("#products");
    let div = document.createElement('div');
    div.setAttribute('class', 'row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-3 justify-content-center');
    div.setAttribute('id', 'filter');

    data.then((products) => {
        let countElem = 0; // counter initialization of items brought from the server
        let countElemControl = 0; // counter initialization of non-matching items according to selected category

        products.forEach(product => {
            countElem++; // counter of items brought from the server

            let elem = document.createElement('div');
            elem.setAttribute('class', 'col mb-5');
    
            let card = document.createElement('div');
            card.setAttribute('class', 'card h-100 shadow');
    
            let img = document.createElement('img');
            img.setAttribute('class', 'card-img-top');
            img.setAttribute('src', `${product.url_image}`);
            img.setAttribute('onerror', 'imgError(this);');
    
            let card_body = document.createElement('div');
            card_body.setAttribute('class', 'card-body p-4');
    
            let card_body_child = document.createElement('div');
            card_body_child.setAttribute('class', 'text-center');
    
            let h5 = document.createElement('h5');
            h5.setAttribute('class', 'fw-bolder');
            h5.appendChild(document.createTextNode(`${product.name}`));

            const hr = document.createElement('hr');
            hr.setAttribute('class', 'dropdown-divider');
            

            let p = document.createElement('p');
    
            let card_footer = document.createElement('div');
            card_footer.setAttribute('class', 'card-footer p-4 pt-0 border-top-0 bg-transparent');
    
            let card_footer_child = document.createElement('div');
            card_footer_child.setAttribute('class', 'text-center');

            let iCart = document.createElement('i');
            iCart.setAttribute('class', 'bi-cart-plus-fill me-1');
    
            let options = document.createElement('a');
            options.setAttribute('class', 'btn btn-outline-dark mt-auto shadow');
            options.setAttribute('onclick', `toCart(${product.id});`);
            options.appendChild(document.createTextNode('Agregar '));
            options.appendChild(iCart);
            
            card_footer_child.appendChild(options);
            card_footer.appendChild(card_footer_child);
    
            h5.appendChild(hr);
            card_body_child.appendChild(h5);

            if (product.discount > 0) {
                let pAux = document.createElement('p');
                pAux.setAttribute('class', 'text-decoration-line-through');
                pAux.appendChild(document.createTextNode(`$ ${product.price}`));
                card_body_child.appendChild(pAux);

                let newPrice = (1 - (product.discount / 100)) * product.price;
                newPrice = Math.round(newPrice);

                p.setAttribute('class', 'text-danger fw-bold');
                p.appendChild(document.createTextNode(`$ ${newPrice}`));

                card_body_child.appendChild(document.createTextNode(`Descuento ${product.discount}%`));
                card_body_child.appendChild(p);
            } else {
                card_body_child.appendChild(document.createTextNode(`$ ${product.price}`));
            }
            
            card_body.appendChild(card_body_child);
    
            card.appendChild(img);
            card.appendChild(card_body);
            card.appendChild(card_footer);
    
            elem.appendChild(card);
            
            // Conditional to separate categorized products
            if (id != 0) {
                if (id == product.category) {
                    console.log('filtrado');
                    div.appendChild(elem);
                } else {
                    countElemControl++; // counter of non-matching items according to selected category
                }
            } else {
                div.appendChild(elem);
            }
            // End.
        });

        // Conditional to check if there are no products found according to the selected category and the other filters that come from the server
        if (countElemControl == countElem) {
            let noResults = document.createElement('p');
            noResults.setAttribute('id', 'noResults');
            noResults.setAttribute('class', 'fs-1 text-center');
            noResults.appendChild(document.createTextNode('No se encontraron productos'));
            HTMLResponseProducts.appendChild(noResults);
        }
        // End.

        HTMLResponseProducts.appendChild(div);
        // update spinner quantity of products, hidden
        spinner.setAttribute('class', 'd-none d-flex justify-content-center');
        HTMLproducts.setAttribute('class', 'bg-light p-3');
        // End.
    });
}
// End.

// Function for capitalize the first letter
function capitalizeFirtsLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// End.

// function to bring the products according to the selected category
function categorize(id) {
    idGlobal = id;
    searching(idGlobal, keyGlobal, cartGlobal);
}
// End.

// function to bring the products ordered according to the selected attribute
function order(key) {
    keyGlobal = key;
    searching(idGlobal, keyGlobal, cartGlobal);
}
// End.

// function to add products to the cart and calculate the total of the purchase
function toCart(id) {
    // update spinner quantity of products, visible
    const spinner = document.querySelector('#spinnerCart');
    spinner.setAttribute('class', 'spinner-border spinner-border-sm');
    // End.

    cartGlobal.push(id); // add products to cart

    // list of non-repeating products
    let cartNoRepeat = cartGlobal.filter((item,index)=>{
        return cartGlobal.indexOf(item) === index;
      })
    // End.

    // list of quantities by product
    let cartUnids = [];
    for (let index=0; index < cartNoRepeat.length; index++) {
        cartUnids[index]=0;
        cartGlobal.forEach(product => {
            if (cartNoRepeat[index] == product) {
                cartUnids[index]++;
            }
        });
    }
    // End.

    // remove existing content to replace it with the update
    const HTMLResponseCart = document.querySelector("#cartToBuy");
    const HTMLUl = document.querySelector('#cartList');
    const HTMLButtonCart = document.querySelector('#buttonCart');
    const HTMLCartEmpty = document.querySelector('#cartEmpty');
    if (HTMLCartEmpty) {
        HTMLResponseCart.removeChild(HTMLCartEmpty);
    }
    if (HTMLUl) {
        HTMLResponseCart.removeChild(HTMLUl);
        HTMLResponseCart.removeChild(document.querySelector('#hrCart'));
        HTMLResponseCart.removeChild(document.querySelector('#cartTotal'));
        HTMLButtonCart.removeChild(document.querySelector('#spanCart'));
    }
    // End.

    let ul = document.createElement('ul');
    ul.setAttribute('id', 'cartList');
    const API_URL = 'http://localhost:8000';
    const ext_URL = '/api/search';

    total = 0; // variable initialization of the purchase total
    elementsCart++; // total products counter

    // Checking products in the cart according to the id to bring them and paint them from the server in the final purchase list
    data = fetchNow(ext_URL, API_URL); // data request to server
    data.then((products) => {
        products.forEach(product => {
            for (let index=0; index < cartNoRepeat.length; index++) {

                if (cartNoRepeat[index] == product.id) { // check products in the cart according to id
                    let HTMLProduct = document.createElement('li');
                    let a = document.createElement('a');
                    let row = document.createElement('div');
                    row.setAttribute('class', 'row');
                    let col = document.createElement('div');
                    col.setAttribute('class', 'col-6');
                    let col2 = document.createElement('div');
                    col2.setAttribute('class', 'col-6 text-end');
                    a.appendChild(document.createTextNode(`${cartUnids[index]} x ${product.name}`));
                    let pUnit = Math.round((product.price) * (1 - (product.discount / 100)));
                    let pUnitTotal = Math.round(pUnit * cartUnids[index]);
                    total += Math.round(pUnitTotal);
                    
                    col2.appendChild(document.createTextNode(`(c/u $${pUnit}) $ ${pUnitTotal}`));
                    col.appendChild(a);
                    row.appendChild(col);
                    row.appendChild(col2);
                    HTMLProduct.appendChild(row);
                    ul.appendChild(HTMLProduct);
                }
            }
        });

        let HTMLTotal = document.createElement('p');
        HTMLTotal.setAttribute('id', 'cartTotal');
        HTMLTotal.setAttribute('class', 'text-end');
        HTMLTotal.appendChild(document.createTextNode(`TOTAL $ ${total}`));
        HTMLResponseCart.appendChild(HTMLTotal);

        const HTMLSpan = document.querySelector('#buttonCart');
        let span = document.createElement('span');
        span.setAttribute('class', 'badge bg-dark text-white ms-1 rounded-pill');
        span.setAttribute('id', 'spanCart');
        span.appendChild(document.createTextNode(`${elementsCart}`));
        HTMLSpan.appendChild(span);
        // End.

        // update spinner quantity of products, hidden
        spinner.setAttribute('class', 'd-none');
        // End .
    });

    const hr = document.createElement('hr');
    hr.setAttribute('class', 'dropdown-divider shadow');
    hr.setAttribute('id', 'hrCart');
    HTMLResponseCart.appendChild(ul);
    HTMLResponseCart.appendChild(hr);
}
// End.

// <--- /FUNCTIONS --->


// <--- WEB APP FLOW --->
const API_URL = 'http://localhost:8000';
var idGlobal = 0;
var keyGlobal = '';
var cartGlobal = [];
var total = 0;
var elementsCart = 0;

searching(idGlobal, keyGlobal); // first call to bring the elements and paint the HTML

// request for product categories to the server
const HTMLResponseCategories = document.querySelector("#categories");

data = fetchNow(ext_URL = '/api/categories', API_URL); // request for categories, by request fecth
// End.

// filling categories to the menu
data.then((categories) => {
    categories.forEach(category => {
        let elem = document.createElement('button');

        let string = category.name;
        string = capitalizeFirtsLetter(string);

        elem.appendChild(document.createTextNode(`${string}`));
        elem.setAttribute('class', 'btn btn-outline-dark my-1');
        elem.setAttribute('id', `v-pills-${category.name}-tab`);
        elem.setAttribute('data-bs-toggle', 'pill');
        elem.setAttribute('data-bs-target', `#v-pills-${category.name}`);
        elem.setAttribute('type', 'button');
        elem.setAttribute('role', 'tab');
        elem.setAttribute('aria-controls', `v-pills-${category.name}`);
        elem.setAttribute('aria-selected', 'false');
        elem.setAttribute('onclick', `categorize(${category.id});`);

        HTMLResponseCategories.appendChild(elem);
    });
});
// End.

// <--- /WEB APP FLOW --->

// <--- Event listener --->

// submit interceptor for search form
window.addEventListener("load", function() {
  document.getElementById('formSearch').addEventListener("submit", function(e) {
    e.preventDefault();
    searching(idGlobal, keyGlobal);
  })
});
// End.

// <--- /Event listener --->