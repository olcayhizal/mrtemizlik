const TelegramBot = require('node-telegram-bot-api');

const token = '7378977230:AAHR9jITyWDNfWkzzVmyUib1uz8XLQ0A-Eo';
const chatId = '-1002423694563';

const bot = new TelegramBot(token);

function formatOrderMessage(orderData) {
    const { contactData, items, totalInfo, selectedAppointment } = orderData;
    
    let message = '🔔 *Yeni Sipariş Alındı!*\n\n';
    
    // Müşteri Bilgileri
    message += '*👤 Müşteri Bilgileri*\n';
    message += `Ad Soyad: ${contactData.name}\n`;
    message += `Telefon: ${contactData.phone}\n`;
    message += `Adres: ${contactData.address}\n`;
    if (contactData.notes) {
        message += `Notlar: ${contactData.notes}\n`;
    }
    message += '\n';
    
    // Randevu Bilgileri
    message += '*📅 Randevu Bilgileri*\n';
    message += `Tarih: ${selectedAppointment.date}\n`;
    message += `Saat: ${selectedAppointment.time}\n\n`;
    
    // Sipariş Detayları
    message += '*🧾 Sipariş Detayları*\n';
    items.forEach(item => {
        message += `• ${item.quantity}x ${item.name} - ${item.priceInfo.formatted}\n`;
    });
    message += '\n';
    
    // Toplam Tutar
    message += '*💰 Toplam Tutar*\n';
    if (totalInfo.discount > 0) {
        message += `İndirimli Tutar: ${totalInfo.formatted}\n`;
        message += `Kazanılan İndirim: ${totalInfo.discount.toLocaleString('tr-TR')} TL`;
    } else {
        message += totalInfo.formatted;
    }
    
    return message;
}

async function sendOrderNotification(orderData) {
    try {
        const message = formatOrderMessage(orderData);
        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        return true;
    } catch (error) {
        console.error('Telegram notification error:', error);
        throw error;
    }
}

module.exports = {
    sendOrderNotification
};