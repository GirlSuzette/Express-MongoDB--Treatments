const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
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
            console - log(`caugth err: ${err}`);
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

const update = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber

    User

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
module.exports = {
    index,
    findBy,
    create
}