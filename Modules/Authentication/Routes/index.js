'use strict'

const express = require('express');
const router = express.Router();
const Guard = require('functions/auth');
const AuthenticationController = require('Modules/AUthentication/Controllers/AuthenticationController');

router.post('/register', (req, res, next) => {
    AuthenticationController.register(req, res, next);
});

router.patch('/activate/:token', (req, res, next) => {
    AuthenticationController.Activate(req, res, next);
});

router.post('/login', (req, res, next) => {
    AuthenticationController.login(req, res, next);
});

router.get("/logout", [Guard.isValidUser], function (req, res, next) {
    AuthenticationController.logout(req, res, next);
});

module.exports = router;