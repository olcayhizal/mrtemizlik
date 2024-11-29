const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { sendOrderNotification } = require('./services/telegramService');

const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('step1');
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    await sendOrderNotification(orderData);
    res.json({ success: true });
  } catch (error) {
    console.error('Order notification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Sipariş bildirimi gönderilemedi' 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});