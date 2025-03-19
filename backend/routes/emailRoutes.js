const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const emailController = require('../controllers/emailController');
const auth = require('../middleware/auth');

// Validation middleware
const emailValidation = [
    body('to').isEmail().withMessage('Invalid recipient email address'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('body').notEmpty().withMessage('Email body is required'),
];

const scheduleValidation = [
    ...emailValidation,
    body('scheduledTime').isISO8601().withMessage('Invalid schedule time format')
];

// Routes
router.post('/send', 
    auth, 
    emailValidation,
    emailController.sendEmail
);

router.post('/schedule', 
    auth, 
    scheduleValidation,
    emailController.scheduleEmail
);

router.get('/history', 
    auth, 
    emailController.getEmailHistory
);

router.get('/scheduled', 
    auth, 
    emailController.getScheduledEmails
);

router.delete('/scheduled/:id', 
    auth, 
    emailController.cancelScheduledEmail
);

module.exports = router;
