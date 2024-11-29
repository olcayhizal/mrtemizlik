import { roundPrice, formatPrice, calculateDiscountedPrice } from '../utils/priceUtils.js';
import { getActiveDiscounts, getBulkDiscount } from '../utils/discountUtils.js';

export class PriceService {
    calculateItemPrice(category, serviceId, quantity, basePrice) {
        // Ensure all inputs are valid numbers
        quantity = parseInt(quantity) || 0;
        basePrice = parseFloat(basePrice) || 0;

        if (quantity <= 0 || basePrice <= 0) {
            return {
                original: basePrice,
                final: basePrice,
                discounts: [],
                total: 0,
                formatted: '0 TL'
            };
        }

        let finalPrice = basePrice;
        let appliedDiscounts = [];
        
        // Check for time-limited discounts
        const activeDiscounts = getActiveDiscounts(category);
        if (activeDiscounts.length > 0) {
            const maxDiscount = Math.max(...activeDiscounts.map(d => d.percent));
            finalPrice = calculateDiscountedPrice(finalPrice, maxDiscount);
            appliedDiscounts.push({
                type: 'time',
                name: activeDiscounts[0].name,
                percent: maxDiscount
            });
        }
        
        // Check for bulk discounts
        const bulkDiscountPercent = getBulkDiscount(category, quantity);
        if (bulkDiscountPercent > 0) {
            finalPrice = calculateDiscountedPrice(finalPrice, bulkDiscountPercent);
            appliedDiscounts.push({
                type: 'bulk',
                name: 'Çoklu Ürün İndirimi',
                percent: bulkDiscountPercent
            });
        }
        
        // Calculate total after all discounts
        const total = finalPrice * quantity;
        
        return {
            original: basePrice,
            final: finalPrice,
            discounts: appliedDiscounts,
            total: total,
            formatted: formatPrice(total)
        };
    }
    
    calculateTotalPrice(items) {
        if (!Array.isArray(items) || items.length === 0) {
            return {
                subtotal: 0,
                discount: 0,
                total: 0,
                formatted: '0 TL'
            };
        }

        let subtotal = 0;
        let totalAfterDiscounts = 0;
        
        items.forEach(item => {
            const quantity = parseInt(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            
            if (quantity > 0 && price > 0) {
                const priceInfo = this.calculateItemPrice(
                    item.category,
                    item.service,
                    quantity,
                    price
                );
                
                subtotal += price * quantity;
                totalAfterDiscounts += priceInfo.total;
            }
        });
        
        const totalDiscount = Math.max(0, subtotal - totalAfterDiscounts);
        
        return {
            subtotal: roundPrice(subtotal),
            discount: roundPrice(totalDiscount),
            total: roundPrice(totalAfterDiscounts),
            formatted: formatPrice(roundPrice(totalAfterDiscounts))
        };
    }
}