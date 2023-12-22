const tabs = document.querySelectorAll('.tab');
const productContainer = document.getElementById('productContainer');
const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            return data.categories;
        }
        throw new Error('Failed to fetch data');
    } catch (error) {
        console.error(error);
    }
}

function renderProducts(category) {
    productContainer.innerHTML = '';
    fetchProducts()
        .then(categories => {
            const selectedCategory = categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
            if (selectedCategory) {
                selectedCategory.category_products.forEach(product => {
                    const card = createProductCard(product);
                    productContainer.appendChild(card);
                });
            }
        });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const image = document.createElement('img');
    image.classList.add('product-image');
    image.src = product.image;
    image.alt = product.title;
    card.appendChild(image);
    if (product.badge_text) {
        const badge = document.createElement('div');
        badge.classList.add('badge');
        badge.textContent = product.badge_text;
        card.appendChild(badge);
    }
    const title = document.createElement('h3');
    title.textContent = product.title;
    card.appendChild(title);

    const vendor = document.createElement('p');
    vendor.textContent = `Vendor: ${product.vendor}`;
    card.appendChild(vendor);

    const price = document.createElement('p');
    price.textContent = `Price: $${product.price}`;
    card.appendChild(price);

    const compareAtPrice = document.createElement('p');
    compareAtPrice.textContent = `Compare at: $${product.compare_at_price}`;
    card.appendChild(compareAtPrice);

    const discount = calculateDiscount(product.price, product.compare_at_price);
    const discountPercentage = document.createElement('p');
    discountPercentage.textContent = `Discount: ${discount}% off`;
    card.appendChild(discountPercentage);

    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'Add to cart';
    card.appendChild(addToCartBtn);

    return card;
}

function calculateDiscount(price, compareAtPrice) {
    const actualPrice = parseFloat(price);
    const comparePrice = parseFloat(compareAtPrice);
    if (actualPrice && comparePrice && actualPrice < comparePrice) {
        const discount = ((comparePrice - actualPrice) / comparePrice) * 100;
        return discount.toFixed(0);
    }
    return 0;
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const category = tab.getAttribute('data-category');
        renderProducts(category);
    });
});

window.addEventListener('load', () => {
    const defaultCategory = 'men';
    document.querySelector(`[data-category="${defaultCategory}"]`).click();
});