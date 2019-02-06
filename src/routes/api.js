const { Router } = require('express');
const app = Router();

const Users = require('../controllers/users/user');
const Treatments = require('../controllers/treatments/treatment');
const Appointments = require('../controllers/appointments/appointment');
const isAuthenticated = require('../../services/Auth')

//Users routes
app.get('/users', isAuthenticated, Users.index);
app.get('/users/:userId', isAuthenticated, Users.findBy);
app.get('/users/:userId/treatments', Users.findtreatmentsBy);
app.post('/users', Users.create);
app.put('/users/:userId', isAuthenticated, Users.updateBy);
app.delete('/users/:userId', isAuthenticated, Users.deleteBy)
//Authentication
app.post('/auth/signup', Users.signup)
app.post('/auth/login', Users.login)

//Treatment routes
app.get('/treatments', Treatments.index);
app.get('/treatments/:treatmentId', Treatments.findBy);
app.post('/treatments', isAuthenticated, Treatments.create)
// app.put('/treatments/:treatmentId', Treatments.updateBy);
// get.get('/treatmets/:treatmentId/appointments', Treatments.findAppointmentsBy)
app.delete('/treatments/:treatmentId', isAuthenticated, Treatments.deleteTreatmentBy);

//Appointments routes
app.get('/appointments', Appointments.index);
// app.get('/appointments/:appointmentId', Appointments.findBy);
// app.post('/appointments', Appointments.create)
// app.put('/appointments/:appointmentId', Appointments.updateBy);
// app.delete('/appointments/:id', Appointments.delete);

module.exports = app;
