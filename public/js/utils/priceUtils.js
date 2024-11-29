// Price rounding utilities
export function roundPrice(price) {
    if (!price || isNaN(price)) return 0;
    // Round to nearest 5 TL
    return Math.ceil(parseFloat(price) / 5) * 5;
}

// Format price with Turkish currency
export function formatPrice(price) {
    if (!price || isNaN(price)) return '0 TL';
    return price.toLocaleString('tr-TR') + ' TL';
}

// Calculate discounted price
export function calculateDiscountedPrice(price, discountPercent) {
    if (!price || isNaN(price) || !discountPercent || isNaN(discountPercent)) {
        return price;
    }
    const discountAmount = parseFloat(price) * (parseFloat(discountPercent) / 100);
    return roundPrice(price - discountAmount);
}