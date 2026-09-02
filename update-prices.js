const fs = require('fs');
let content = fs.readFileSync('lib/products.ts', 'utf8');

content = content.replace(/price: '\$\d+', priceNum: \d+/g, "price: '₹1', priceNum: 1");
content = content.replace(/originalPrice: '\$\d+'/g, "originalPrice: ''");

fs.writeFileSync('lib/products.ts', content);
console.log('Prices updated successfully.');
