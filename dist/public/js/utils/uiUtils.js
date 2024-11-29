export function showToast(title, message, type = 'info') {
    const toast = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-${type} text-white">
                    <strong class="me-auto">${title}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        </div>
    `;
    
    $('body').append(toast);
    const toastElement = $('.toast').last();
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();
    
    toastElement.on('hidden.bs.toast', function() {
        $(this).parent().remove();
    });
}

export function showValidationErrors(errors) {
    // Clear previous error states
    $('.is-invalid').removeClass('is-invalid');
    $('.invalid-feedback').remove();
    
    // Add new error states
    errors.forEach(error => {
        const field = $(`#${error.field}`);
        field.addClass('is-invalid');
        field.after(`<div class="invalid-feedback">${error.message}</div>`);
    });
    
    // Show toast with summary
    if (errors.length > 0) {
        showToast(
            'Form Hatası',
            'Lütfen form alanlarını kontrol ediniz',
            'warning'
        );
    }
}