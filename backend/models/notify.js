const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    notifyDate: { type: Date, required: true },
    message: {
        type: String,
        required: true
    },
    read: {type: Boolean},
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    link: {
        type: String
    },
});

const Notify = mongoose.model('Notify', notificationSchema);

module.exports = Notify;
