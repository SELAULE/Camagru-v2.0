const mongoose = require('mongoose');

// pictures Schema 
let picSchema = mongoose.Schema ({ 
    user_id: {
        type: string,
        require: true
    },
    name: {
        type: string,
        require: true
    },
    date: {
        type: date,
        require: true
    }
})