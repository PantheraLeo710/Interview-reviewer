const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const authenticateToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');


// Add a new question (only accessible by interviewer)
router.post('/', authenticateToken, requireRole('staff'), async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !options || !correctAnswer) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ message: 'Options must be an array with at least 2 items' });
    }

    if (!options.includes(correctAnswer)) {
        return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }

    try {
        const question = new Question({
            questionText,
            options,
            correctAnswer,
            createdBy: req.user.id
        });

        await question.save();
        res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/', authenticateToken, async (req, res) => {
    try {
        console.log("Decoded JWT inside questions route:", req.user);
        const questions = await Question.find().select('-correctAnswer'); 
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
