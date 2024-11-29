// Prices configuration
export const prices = {
    'koltuk': {
        '3lu': 350,
        '2li': 200,
        'tekli': 100,
        'L': 500
    },
    'sandalye': {
        'oturmali': 50,
        'yaslanmali': 75
    },
    'yatak': {
        'tek': 750,
        'cift': 1000
    },
    'arac': {
        'binek': 800,
        'servis': 1500,
        'otobus': 2500
    }
};

export const categoryTitles = {
    'koltuk': 'Koltuklar',
    'sandalye': 'Sandalyeler',
    'yatak': 'Yataklar',
    'arac': 'Araç Koltukları'
};

export const services = {
    'koltuk': [
        {id: '3lu', name: "3'lü Koltuk", price: 350, icon: 'fa-couch'},
        {id: '2li', name: "2'li Koltuk", price: 200, icon: 'fa-couch'},
        {id: 'tekli', name: "Tekli Koltuk", price: 100, icon: 'fa-chair'},
        {id: 'L', name: "L Koltuk", price: 500, icon: 'fa-couch'}
    ],
    'sandalye': [
        {id: 'oturmali', name: "Oturmalı Sandalye", price: 50, icon: 'fa-chair'},
        {id: 'yaslanmali', name: "Oturmalı ve Yaslanmalı Sandalye", price: 75, icon: 'fa-chair'}
    ],
    'yatak': [
        {id: 'tek', name: "Tek Kişilik Yatak", price: 750, icon: 'fa-bed'},
        {id: 'cift', name: "Çift Kişilik Yatak", price: 1000, icon: 'fa-bed'}
    ],
    'arac': [
        {id: 'binek', name: "Binek Araç", price: 800, icon: 'fa-car'},
        {id: 'servis', name: "Servis Aracı", price: 1500, icon: 'fa-van-shuttle'},
        {id: 'otobus', name: "Otobüs", price: 2500, icon: 'fa-bus'}
    ]
};