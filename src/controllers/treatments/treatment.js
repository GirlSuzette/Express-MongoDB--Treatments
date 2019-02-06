const mongoose = require('mongoose');
const Treatment = require('../../models/Treatment')
const Appointment = require('../../models/Appointment')

const index = (req, res) => {
    Treatment
        .find()
        .exec()
        .then(data => {
            res
                .json({
                    type: 'Getting Treatments',
                    data: data
                })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err: ${err}`);
            return res.status(500).json(err)
        })
}
const findBy = (req, res) => {
    Treatment
        .findById(req.params.treatmentId)
        .then(data => {
            res.json({
                type: 'Found Treatment by Id',
                data: data
            })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err: ${err}`);
            return res.status(500).json(err)
        })
}
const createAppointment = (body, day) => {
    const newAppointment = new Appointment({
        _id: mongoose.Types.ObjectId(),
        name: body.name,
        phoneNumber: body.phoneNumber,
        day,
        treatment: body._id,
        user: body.user,

    })

    newAppointment.save()

    return newAppointment._id
}



const create = (req, res) => {
    console.log(req)
    const newIds = req.body.listOfTreatments.split(',')
    console.log(newIds)
    const newTreatment = new Treatment({
        _id: mongoose.Types.ObjectId(),
        description: req.body.description,
        listOfTreatments: req.body.listOfTreatments,
        user: req.body.user,
        listOfAppointments: newIds.map((day) => createAppointment(req.body, day))
    })
    newTreatment
        .save()
        .then(data => {
            res.json({
                type: 'New treatment',
                data: data
            })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err ${err}`);
            return res.status(500).json({ message: 'Post Failed' })
        })
}

const deleteTreatmentBy = (req, res) => {
    Treatment
        .findById(req.params.treatmentId, function (err, treatment) {
            if (!err) {
                Appointment.deleteMany({ user: { $in: [treatment._id] } }, function (err) { })
                treatment
                    .remove()
                    .then(() => {
                        res
                            .status(200)
                            .json({
                                message: 'Treatment was deleted'
                            });
                    });
            }
        })
        .catch(err => {
            console.log(`caught error: ${err}`);
            return res.status(401).json({ message: 'You dont have permission' })
        })
}
module.exports = {
    index,
    findBy,
    create,
    deleteTreatmentBy
}