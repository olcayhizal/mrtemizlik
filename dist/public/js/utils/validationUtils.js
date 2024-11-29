export function validateContactForm(data) {
    const errors = [];
    
    // Name validation
    if (!data.name) {
        errors.push({ field: 'name', message: 'Ad Soyad alanı zorunludur' });
    } else if (data.name.length < 3) {
        errors.push({ field: 'name', message: 'Ad Soyad en az 3 karakter olmalıdır' });
    }
    
    // Phone validation
    if (!data.phone) {
        errors.push({ field: 'phone', message: 'Telefon alanı zorunludur' });
    } else if (!/^[0-9]{10,11}$/.test(data.phone)) {
        errors.push({ field: 'phone', message: 'Geçerli bir telefon numarası giriniz' });
    }
    
    // Address validation
    if (!data.address) {
        errors.push({ field: 'address', message: 'Adres alanı zorunludur' });
    } else if (data.address.length < 10) {
        errors.push({ field: 'address', message: 'Adres en az 10 karakter olmalıdır' });
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}