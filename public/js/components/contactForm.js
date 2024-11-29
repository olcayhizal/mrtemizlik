export function createContactForm() {
    return `
        <div class="contact-form">
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="name" class="form-label">Ad Soyad</label>
                    <input type="text" class="form-control" id="name" required>
                </div>
                <div class="col-md-6">
                    <label for="phone" class="form-label">Telefon</label>
                    <input type="tel" class="form-control" id="phone" required>
                </div>
                <div class="col-12">
                    <label for="address" class="form-label">Adres</label>
                    <textarea class="form-control" id="address" rows="3" required></textarea>
                </div>
                <div class="col-12">
                    <label for="notes" class="form-label">Notlar (Opsiyonel)</label>
                    <textarea class="form-control" id="notes" rows="2"></textarea>
                </div>
            </div>
        </div>
    `;
}