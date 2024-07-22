let allProducts = [];
        let filteredProducts = [];

        async function fetchProducts() {
            try {
                const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                if (!data.categories) throw new Error('Invalid JSON structure');
                data.categories.forEach(category => {
                    category.category_products.forEach(product => {
                        product.product_type = category.category_name;
                        allProducts.push(product);
                    });
                });
                filteredProducts = allProducts;
                displayProducts(filteredProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                document.getElementById('products').innerHTML = '<p>Error fetching products. Please try again later.</p>';
            }
        }

        function displayProducts(products) {
            const productsDiv = document.getElementById('products');
            productsDiv.innerHTML = '';
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <h2>${product.title}</h2>
                    <p>Vendor: ${product.vendor}</p>
                    <p>Category: ${product.product_type}</p>
                    <p>Price: ${product.price}</p>
                    <p>Compare at price: ${product.compare_at_price}</p>
                    <img src="${product.image}" alt="${product.title}" width="100">
                    ${product.second_image && product.second_image !== "empty" ? `<img src="${product.second_image}" alt="${product.title}" width="100">` : ''}
                `;
                productsDiv.appendChild(productDiv);
            });
        }

        function filterProducts(category) {
            if (category === 'All') {
                filteredProducts = allProducts;
            } else {
                filteredProducts = allProducts.filter(product => product.product_type === category);
            }
            displayProducts(filteredProducts);
        }

        function searchProducts() {
            const searchTerm = document.getElementById('search').value.toLowerCase();
            const searchedProducts = filteredProducts.filter(product =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.vendor.toLowerCase().includes(searchTerm) ||
                product.product_type.toLowerCase().includes(searchTerm)
            );
            displayProducts(searchedProducts);
        }

        // Fetch and display products when the page loads
        fetchProducts();