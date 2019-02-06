const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const User = require('../../models/User');
const Treatment = require('../../models/Treatment')
const Appointment = require('../../models/Appointment')
const jwt = require('jsonwebtoken')

const index = (req, res) => {
    User
        .find()
        .exec()
        .then(users => {
            res
                .json({
                    users,
                    total: users.length
                })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err: ${err}`);
            return res.status(500).json(err)
        })
}
const create = (req, res) => {
    const newUser = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email
    })
    console.log(newUser)
        .save()
        .then(data => {
            res.json({
                type: 'New User',
                data: data
            })
                .status(200)

        })
        .catch(err => {
            console.log(`caugth err ${err}`);
            return res.status(500).json({ message: 'Post Failed' })
        })

}

const signup = (req, res) => {
    User
        .find({ email: req.body.email })
        .exec()
        .then(users => {
            if (users.length < 1) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500)
                            .json({ message: err })
                    }

                    const newUser = new User({
                        _id: mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        phoneNumber: req.body.phoneNumber,

                    })
                    newUser
                        .save()
                        .then(saved => {
                            res.status(200)
                                .json({
                                    message: "User created successfully",
                                    data: saved
                                })
                        })
                })
            } else {
                res.status(422) // ya existe ese obj
                    .json({
                        message: 'User already exist.'
                    })
            }
        })
}

const login = (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401)
                            .json({
                                message: "Autentication Failed"
                            })
                    }
                    if (result) {
                        const token = jwt.sign({
                            name: user[0].name,
                            email: user[0].email,
                        }, process.env.JWT_SECRETKEY, {
                                expiresIn: "1hr"
                            });
                        return res
                            .status(200)
                            .json({
                                message: 'Authentication Successfull',
                                token
                            })
                    }
                    res.status(401)
                        .json({
                            message: "Authentication"
                        })
                })
            } else {
                res
                    .status(422)
                    .json({
                        message: "Authentication Failed"
                    })
            }
        })
}

const findBy = (req, res) => {
    User
        .findById(req.params.userId)
        .exec()
        .then(data => {

            res.json({
                type: 'Found User by Id',
                data: data
            })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err ${err}`);
            return res.status(500).json(err)
        })
}

const updateBy = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;

    User
        .findOne({ _id: req.params.userId })
        .then(function (user) {
            // console.log(user)
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    user.name = name;
                    user.email = email;
                    user.phoneNumber = phoneNumber;

                    user.save()
                        .then(saved => {
                            res
                                .status(201)
                                .json({
                                    message: "user update successfully",
                                    user: saved
                                })
                        })
                } else {
                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500)
                                .json({
                                    message: error
                                })
                        }
                        user.name = name;
                        user.email = email;
                        user.phoneNumber = phoneNumber;
                        user.password = hash;
                        console.log(user)
                        user.save()
                            .then(saved => {
                                res.status(201)
                                    .json({
                                        message: "user update succeefully",
                                        user: saved
                                    });
                            })
                    });
                }
            });
        }).catch(err => {
            console.log(`caugt the error: ${err}`);
            return res.status(404).json({ "type": "Not Found" })
        })

}



const findtreatmentsBy = (req, res) => {
    Treatment
        .find({ user: req.params.userId })
        // .populate()
        .exec()
        .then(data => {
            res.json({
                type: 'Finding the treatment',
                data: data
            })
                .status(200)
        })
        .catch(err => {
            console.log(`caugth err: ${err}`);
            return res.status(500).json(err)
        })
}

const deleteBy = (req, res) => {
    User
        .findById(req.params.userId, function (err, user) {
            if (!err) {
                Appointment.deleteMany({ user: { $in: [user._id] } }, function (err) { })
                Treatment.deleteMany({ user: { $in: [user._id] } }, function (err) { })
                user
                    .remove()
                    .then(() => {
                        res.status(200)
                            .json({
                                message: 'User was deleted'
                            })
                    })
            }

        }).catch(err => {
            console.log(`caugth err: ${err}`);
            return res.status(500).json({ message: 'You do not have permission' })
        })

}

module.exports = {
    index,
    create,
    findBy,
    updateBy,
    findtreatmentsBy,
    signup,
    login,
    deleteBy
}