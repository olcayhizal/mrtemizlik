export function createOrderSummary(items, totalInfo) {
    let html = `
        <div class="order-summary">
            <h5 class="mb-3">Sipariş Özeti</h5>
            <div class="summary-items">
    `;
    
    items.forEach(item => {
        html += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${item.quantity}x ${item.name}</span>
                <span class="fw-bold">${item.priceInfo.formatted}</span>
            </div>
        `;
    });
    
    html += `
            </div>
            <hr>
            <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold">Toplam</span>
                <div class="text-end">
                    ${totalInfo.discount > 0 ? 
                        `<small class="text-decoration-line-through text-secondary">
                            ${totalInfo.subtotal.toLocaleString('tr-TR')} TL
                        </small><br>` : 
                        ''}
                    <span class="fs-5 fw-bold ${totalInfo.discount > 0 ? 'text-success' : ''}">
                        ${totalInfo.formatted}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    return html;
}