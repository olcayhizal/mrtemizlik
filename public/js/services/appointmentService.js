export class AppointmentService {
    getAvailableSlots(date) {
        // In a real app, this would fetch from an API
        // For demo, generate slots between 9 AM and 5 PM
        const slots = [];
        const startHour = 9;
        const endHour = 17;
        
        for (let hour = startHour; hour < endHour; hour++) {
            slots.push({
                time: `${hour}:00`,
                available: Math.random() > 0.3 // Randomly mark some slots as unavailable
            });
            slots.push({
                time: `${hour}:30`,
                available: Math.random() > 0.3
            });
        }
        
        return slots;
    }
    
    isValidDate(date) {
        const selected = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Only allow dates up to 30 days in the future
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        
        return selected >= today && selected <= maxDate;
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}