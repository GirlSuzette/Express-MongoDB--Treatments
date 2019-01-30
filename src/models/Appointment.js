const mongoose = require('mongoose');
const { Schema } = mongoose

const appointmentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: Number,
        required: false
    },
    day: {
        type: String,
        required: true
    },
    treatmentId: { type: Schema.Types.ObjectId, ref: 'Treatment' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }


})

module.exports = mongoose.model('Appointment', appointmentSchema)