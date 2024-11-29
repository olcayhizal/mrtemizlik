export function createAppointmentPicker() {
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split('T')[0];
    
    return `
        <div class="appointment-picker">
            <div class="date-picker mb-4">
                <label for="appointment-date" class="form-label">Tarih Seçin</label>
                <input type="date" 
                       class="form-control" 
                       id="appointment-date" 
                       min="${today}" 
                       max="${maxDateStr}"
                       required>
            </div>
            <div id="time-slots-container" class="mt-4">
                <div class="text-center text-secondary">
                    <i class="fas fa-calendar-alt fa-2x mb-2"></i>
                    <p>Lütfen önce bir tarih seçin</p>
                </div>
            </div>
        </div>
    `;
}

export function initializeAppointmentPicker(appointmentService, onTimeSelected) {
    const dateInput = document.getElementById('appointment-date');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    
    dateInput.addEventListener('change', function() {
        const selectedDate = this.value;
        if (!selectedDate) {
            timeSlotsContainer.innerHTML = `
                <div class="text-center text-secondary">
                    <i class="fas fa-calendar-alt fa-2x mb-2"></i>
                    <p>Lütfen bir tarih seçin</p>
                </div>
            `;
            return;
        }
        
        if (!appointmentService.isValidDate(selectedDate)) {
            timeSlotsContainer.innerHTML = `
                <div class="text-center text-danger">
                    <i class="fas fa-exclamation-circle fa-2x mb-2"></i>
                    <p>Geçersiz tarih seçimi</p>
                </div>
            `;
            return;
        }
        
        const slots = appointmentService.getAvailableSlots(selectedDate);
        const formattedDate = appointmentService.formatDate(selectedDate);
        
        let html = `
            <h5 class="mb-3">${formattedDate} için müsait saatler:</h5>
            <div class="time-slots">
        `;
        
        slots.forEach(slot => {
            html += `
                <button class="time-slot ${slot.available ? '' : 'disabled'}"
                        ${slot.available ? '' : 'disabled'}
                        data-time="${slot.time}"
                        data-date="${selectedDate}">
                    ${slot.time}
                </button>
            `;
        });
        
        html += '</div>';
        timeSlotsContainer.innerHTML = html;
        
        // Add click handlers to time slots
        document.querySelectorAll('.time-slot:not(.disabled)').forEach(slot => {
            slot.addEventListener('click', function() {
                // Remove previous selection
                document.querySelectorAll('.time-slot.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Add selection to clicked slot
                this.classList.add('selected');
                
                // Call callback with selected date and time
                if (onTimeSelected) {
                    onTimeSelected({
                        date: this.dataset.date,
                        time: this.dataset.time
                    });
                }
            });
        });
    });
}