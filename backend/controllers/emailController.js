const { validationResult } = require('express-validator');
const schedule = require('node-schedule');
const mailer = require('../utils/mailer');

// Store scheduled jobs in memory (in production, use a database)
const scheduledJobs = new Map();
// Store email history in memory (in production, use a database)
const emailHistory = [];

exports.sendEmail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { to, subject, body } = req.body;

        // Send email using nodemailer
        await mailer.sendMail({
            to,
            subject,
            html: body
        });

        // Store in history
        emailHistory.push({
            id: Date.now().toString(),
            to,
            subject,
            body,
            sentAt: new Date(),
            status: 'sent'
        });

        res.json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
};

exports.scheduleEmail = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { to, subject, body, scheduledTime } = req.body;
        const jobId = Date.now().toString();

        // Schedule the email
        const job = schedule.scheduleJob(new Date(scheduledTime), async () => {
            try {
                await mailer.sendMail({
                    to,
                    subject,
                    html: body
                });

                // Add to history after sending
                emailHistory.push({
                    id: jobId,
                    to,
                    subject,
                    body,
                    scheduledFor: scheduledTime,
                    sentAt: new Date(),
                    status: 'sent'
                });

                // Remove from scheduled jobs
                scheduledJobs.delete(jobId);
            } catch (error) {
                console.error('Error sending scheduled email:', error);
                emailHistory.push({
                    id: jobId,
                    to,
                    subject,
                    body,
                    scheduledFor: scheduledTime,
                    error: error.message,
                    status: 'failed'
                });
            }
        });

        // Store the job
        scheduledJobs.set(jobId, {
            id: jobId,
            job,
            to,
            subject,
            body,
            scheduledTime
        });

        res.json({
            success: true,
            message: 'Email scheduled successfully',
            jobId
        });
    } catch (error) {
        console.error('Error scheduling email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to schedule email',
            error: error.message
        });
    }
};

exports.getEmailHistory = (req, res) => {
    try {
        res.json({
            success: true,
            history: emailHistory
        });
    } catch (error) {
        console.error('Error fetching email history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch email history',
            error: error.message
        });
    }
};

exports.getScheduledEmails = (req, res) => {
    try {
        const scheduled = Array.from(scheduledJobs.values()).map(({ id, to, subject, body, scheduledTime }) => ({
            id,
            to,
            subject,
            body,
            scheduledTime
        }));

        res.json({
            success: true,
            scheduled
        });
    } catch (error) {
        console.error('Error fetching scheduled emails:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch scheduled emails',
            error: error.message
        });
    }
};

exports.cancelScheduledEmail = (req, res) => {
    try {
        const { id } = req.params;
        const scheduledJob = scheduledJobs.get(id);

        if (!scheduledJob) {
            return res.status(404).json({
                success: false,
                message: 'Scheduled email not found'
            });
        }

        // Cancel the job
        scheduledJob.job.cancel();
        scheduledJobs.delete(id);

        res.json({
            success: true,
            message: 'Scheduled email cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling scheduled email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel scheduled email',
            error: error.message
        });
    }
};
