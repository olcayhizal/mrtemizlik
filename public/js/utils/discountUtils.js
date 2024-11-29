// Active discounts configuration
export const discounts = {
    // Time-limited discounts
    timeLimited: [
        {
            id: 'summer2023',
            name: 'Yaz Kampanyası',
            percent: 20,
            startDate: '2023-06-01',
            endDate: '2023-08-31',
            categories: ['koltuk', 'yatak']
        },
        {
            id: 'weekend',
            name: 'Hafta Sonu İndirimi',
            percent: 15,
            daysOfWeek: [6, 0], // Saturday and Sunday
            categories: ['arac']
        }
    ],
    
    // Bulk discounts
    bulk: [
        {
            category: 'koltuk',
            threshold: 3,
            percent: 10
        },
        {
            category: 'sandalye',
            threshold: 6,
            percent: 15
        }
    ]
};

// Check if a time-limited discount is active
export function isDiscountActive(discount) {
    const now = new Date();
    
    // Check date range if specified
    if (discount.startDate && discount.endDate) {
        const start = new Date(discount.startDate);
        const end = new Date(discount.endDate);
        if (now < start || now > end) return false;
    }
    
    // Check day of week if specified
    if (discount.daysOfWeek) {
        const currentDay = now.getDay();
        if (!discount.daysOfWeek.includes(currentDay)) return false;
    }
    
    return true;
}

// Get active discounts for a category
export function getActiveDiscounts(category) {
    return discounts.timeLimited.filter(discount => 
        discount.categories.includes(category) && 
        isDiscountActive(discount)
    );
}

// Calculate bulk discount
export function getBulkDiscount(category, quantity) {
    const bulkDiscount = discounts.bulk.find(d => 
        d.category === category && 
        quantity >= d.threshold
    );
    return bulkDiscount ? bulkDiscount.percent : 0;
}