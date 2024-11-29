import { prices, categoryTitles, services } from './prices.js';
import { PriceService } from './services/priceService.js';
import { AppointmentService } from './services/appointmentService.js';
import { createAppointmentPicker, initializeAppointmentPicker } from './components/appointmentPicker.js';
import { createContactForm } from './components/contactForm.js';
import { createOrderSummary } from './components/orderSummary.js';
import { showToast, showValidationErrors } from './utils/uiUtils.js';
import { validateContactForm } from './utils/validationUtils.js';

document.addEventListener('DOMContentLoaded', function() {
    let selectedCategories = [];
    let cart = new Map();
    let selectedAppointment = null;
    const priceService = new PriceService();
    const appointmentService = new AppointmentService();
    
    updateProgressBar(1);

    // Step 1: Category Selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            
            if (this.classList.contains('selected')) {
                // Remove category
                this.classList.remove('selected');
                const check = this.querySelector('.selected-check');
                if (check) check.remove();
                selectedCategories = selectedCategories.filter(cat => cat !== category);
            } else {
                // Add category
                this.classList.add('selected');
                const checkDiv = document.createElement('div');
                checkDiv.className = 'selected-check';
                checkDiv.innerHTML = '<i class="fas fa-check"></i>';
                this.appendChild(checkDiv);
                selectedCategories.push(category);
            }
        });
    });

    document.getElementById('step1-next').addEventListener('click', function() {
        if (selectedCategories.length === 0) {
            showToast('Uyarı', 'Lütfen en az bir kategori seçiniz', 'warning');
            return;
        }
        
        let step2Html = '';
        selectedCategories.forEach(category => {
            step2Html += generateServiceOptions(category);
        });
        
        document.getElementById('step2-services').innerHTML = step2Html;
        initializeQuantityControls();
        
        fadeOut(document.getElementById('step1'), () => {
            fadeIn(document.getElementById('step2'));
            updateProgressBar(2);
        });
    });

    // Step 2: Service Selection
    function generateServiceOptions(category) {
        const categoryServices = services[category];
        
        return `
            <div class="category-section mb-4">
                <div class="category-header d-flex align-items-center mb-3">
                    <i class="fas fa-${getCategoryIcon(category)} me-2"></i>
                    <h3 class="mb-0">${categoryTitles[category]}</h3>
                </div>
                <div class="row g-4">
                    ${categoryServices.map(service => `
                        <div class="col-lg-6">
                            <div class="service-card">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 class="card-title">${service.name}</h5>
                                            <span class="price-badge">${service.price} TL</span>
                                        </div>
                                        <i class="fas ${service.icon} fa-2x text-primary"></i>
                                    </div>
                                    <div class="quantity-control d-flex align-items-center justify-content-between">
                                        <div class="d-flex align-items-center">
                                            <button class="quantity-btn minus" 
                                                    data-category="${category}" 
                                                    data-service="${service.id}">
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <input type="number" 
                                                   class="quantity-input"
                                                   value="0"
                                                   min="0"
                                                   max="99"
                                                   data-category="${category}"
                                                   data-service="${service.id}"
                                                   data-price="${service.price}">
                                            <button class="quantity-btn plus"
                                                    data-category="${category}"
                                                    data-service="${service.id}">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="service-total">
                                            <span class="fw-bold">0 TL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function initializeQuantityControls() {
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                const currentVal = parseInt(input.value) || 0;
                if (currentVal < 99) {
                    input.value = currentVal + 1;
                    updatePrice(input);
                }
            });
        });

        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                const currentVal = parseInt(input.value) || 0;
                if (currentVal > 0) {
                    input.value = currentVal - 1;
                    updatePrice(input);
                }
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                updatePrice(this);
            });

            input.addEventListener('input', function() {
                let value = parseInt(this.value) || 0;
                if (value < 0) this.value = 0;
                if (value > 99) this.value = 99;
                updatePrice(this);
            });
        });
    }

    function updatePrice(input) {
        const quantity = parseInt(input.value) || 0;
        const category = input.dataset.category;
        const serviceId = input.dataset.service;
        const basePrice = parseFloat(input.dataset.price);
        
        const priceInfo = priceService.calculateItemPrice(category, serviceId, quantity, basePrice);
        
        // Update service total
        const serviceTotal = input.closest('.service-card').querySelector('.service-total span');
        serviceTotal.textContent = priceInfo.formatted;
        
        // Update cart
        if (quantity > 0) {
            const service = services[category].find(s => s.id === serviceId);
            cart.set(`${category}-${serviceId}`, {
                category,
                service: serviceId,
                name: service.name,
                quantity,
                price: basePrice,
                priceInfo
            });
        } else {
            cart.delete(`${category}-${serviceId}`);
        }
        
        updateFloatingCart();
    }

    function updateFloatingCart() {
        const itemCount = cart.size;
        const cartBadge = document.getElementById('cart-item-count');
        const floatingCart = document.querySelector('.floating-cart');
        const totalElement = document.getElementById('floating-total');
        
        cartBadge.textContent = itemCount;
        floatingCart.classList.toggle('hidden', itemCount === 0);
        
        if (itemCount > 0) {
            const totalInfo = priceService.calculateTotalPrice(Array.from(cart.values()));
            totalElement.innerHTML = totalInfo.formatted;
        }
    }

    // Step 2 to Step 3 Navigation
    document.getElementById('step2-next').addEventListener('click', function() {
        if (cart.size === 0) {
            showToast('Uyarı', 'Lütfen en az bir hizmet seçiniz', 'warning');
            return;
        }
        
        // Initialize appointment picker and contact form
        document.getElementById('appointment-container').innerHTML = createAppointmentPicker();
        document.getElementById('contact-container').innerHTML = createContactForm();
        
        // Initialize appointment picker functionality
        initializeAppointmentPicker(appointmentService, (appointment) => {
            selectedAppointment = appointment;
            document.getElementById('complete-order').disabled = false;
        });
        
        // Generate order summary
        const items = Array.from(cart.values());
        const totalInfo = priceService.calculateTotalPrice(items);
        document.getElementById('final-summary').innerHTML = createOrderSummary(items, totalInfo);
        
        // Disable complete order button until appointment is selected
        document.getElementById('complete-order').disabled = true;
        
        fadeOut(document.getElementById('step2'), () => {
            fadeIn(document.getElementById('step3'));
            updateProgressBar(3);
        });
    });

    // Complete Order
    document.getElementById('complete-order').addEventListener('click', async function() {
        if (!selectedAppointment) {
            showToast('Uyarı', 'Lütfen randevu seçiniz', 'warning');
            return;
        }
        
        const contactData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            notes: document.getElementById('notes').value
        };
        
        const validation = validateContactForm(contactData);
        if (!validation.isValid) {
            showValidationErrors(validation.errors);
            return;
        }
        
        const items = Array.from(cart.values());
        const totalInfo = priceService.calculateTotalPrice(items);
        
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contactData,
                    items,
                    totalInfo,
                    selectedAppointment
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                fadeOut(document.getElementById('step3'), () => {
                    document.getElementById('confirmation-details').innerHTML = `
                        <div class="text-center mb-4">
                            <h4>Randevu Bilgileri</h4>
                            <p class="mb-0">${appointmentService.formatDate(selectedAppointment.date)}</p>
                            <p>Saat: ${selectedAppointment.time}</p>
                        </div>
                        <hr>
                        <div class="mb-4">
                            <h4>İletişim Bilgileri</h4>
                            <p class="mb-1"><strong>Ad Soyad:</strong> ${contactData.name}</p>
                            <p class="mb-1"><strong>Telefon:</strong> ${contactData.phone}</p>
                            <p class="mb-1"><strong>Adres:</strong> ${contactData.address}</p>
                            ${contactData.notes ? `<p class="mb-0"><strong>Notlar:</strong> ${contactData.notes}</p>` : ''}
                        </div>
                        <hr>
                        ${createOrderSummary(items, totalInfo)}
                    `;
                    fadeIn(document.getElementById('step4'));
                    updateProgressBar(4);
                });
            } else {
                throw new Error(result.error || 'Sipariş oluşturulamadı');
            }
        } catch (error) {
            showToast('Hata', error.message, 'danger');
        }
    });

    // Utility Functions
    function fadeOut(element, callback) {
        element.style.opacity = 1;
        (function fade() {
            if ((element.style.opacity -= 0.1) < 0) {
                element.style.display = 'none';
                if (callback) callback();
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    function fadeIn(element, display = 'block') {
        element.style.opacity = 0;
        element.style.display = display;
        (function fade() {
            let val = parseFloat(element.style.opacity);
            if (!((val += 0.1) > 1)) {
                element.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }

    function updateProgressBar(step) {
        const width = (step / 4) * 100;
        document.querySelector('.progress-bar').style.width = `${width}%`;
    }

    function getCategoryIcon(category) {
        const icons = {
            'koltuk': 'couch',
            'sandalye': 'chair',
            'yatak': 'bed',
            'arac': 'car-side'
        };
        return icons[category] || 'tag';
    }
});