export function createDiscountBadge(discounts) {
    if (!discounts || discounts.length === 0) return '';
    
    const badges = discounts.map(discount => `
        <span class="discount-badge ${discount.type === 'time' ? 'time-limited' : 'bulk'}">
            <i class="fas ${discount.type === 'time' ? 'fa-clock' : 'fa-tags'} me-1"></i>
            ${discount.name} (-${discount.percent}%)
        </span>
    `).join('');
    
    return `<div class="discount-badges">${badges}</div>`;
}