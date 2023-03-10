const replaceTemplate = (temp, product) => {
    let output = temp
        .replace(/{%PRODUCT_NAME%}/g, product.productName)
        .replace(/{%IMAGE%}/g, product.image)
        .replace(/{%PRICE%}/g, product.price)
        .replace(/{%FROM%}/g, product.from)
        .replace(/{%NUTRIENTS%}/g, product.nutrients)
        .replace(/{%QUANTITY%}/g, product.quantity)
        .replace(/{%DESCRIPTION%}/g, product.description)
        .replace(/{%ID%}/g, product.id);

    if (!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
    else output = output.replace(/{%NOT_ORGANIC%}/g, "organic");

    return output;
};

module.exports = { replaceTemplate };
