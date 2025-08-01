const Staff = require('../models/Staff');

const express = require('express');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    const { applicantId, interviewerName, feedbackText, result } = req.body;
    console.log(req.body, "BODY")

    try {
        const feedback = new Feedback({
            applicantId,
            interviewerName,
            feedbackText,
            result
        });

        await feedback.save();

        // Find the applicant
        const applicant = await User.findById(applicantId);

        if (!applicant) {
            return res.status(404).json({ message: 'Applicant not found' });
        }

        if (result === 'pass') {
            // Promote to staff
            const newStaff = new Staff({
                name: applicant.name,
                email: applicant.email
            });

            await newStaff.save();
            console.log(`Applicant ${applicantId} passed — promoted to staff`);
        } else if (result === 'fail') {
            // Delete the applicant
            await User.findByIdAndDelete(applicantId);
            console.log(`Applicant ${applicantId} failed — deleted from applicants`);
        }

        res.status(201).json({ message: 'Feedback submitted and action taken' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authenticateToken, requireRole('staff'), async (req, res) => {
  const feedbacks = await Feedback.find().populate('applicantId')
  res.json(feedbacks);
});



module.exports = router;



















/*
// Submit feedback
router.post('/', verifyToken, async (req, res) => {
    const { applicantId, interviewerName, feedbackText, result } = req.body;

    try {
        const feedback = new Feedback({
            applicantId,
            interviewerName,
            feedbackText,
            result
        });

        await feedback.save();

        // Promotion or deletion logic
        if (result === 'pass') {
            console.log(`Applicant ${applicantId} passed — promote to staff`);
            // Here, you'd move them to a "staff" collection (we can do this in next step)
        } else if (result === 'fail') {
            console.log(`Applicant ${applicantId} failed — schedule for deletion`);
            // For now, just a console log
        }

        res.status(201).json({ message: 'Feedback submitted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting feedback' });
    }
});

module.exports = router;
*/
