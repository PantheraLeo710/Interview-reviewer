// src/pages/StaffDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../config';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';


const StaffDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
      toast.warning('Unauthorized. Please login again.');
      navigate('/login');
      return;
    }

    let decoded;
    try {
      decoded = jwt_decode(token);
    } catch (err) {
      console.error('Invalid token', err);
      navigate('/login');
      return;
    }

    if (!decoded.isStaff) {
      toast.error('Unauthorized. Access denied. get promoted to staff to access. pass the test.');
      navigate('/questions');
      return;
    }

    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [subsRes, fbRes] = await Promise.all([
          axios.get(API.ALL_SUBMISSIONS, { headers }),
          axios.get(API.FEEDBACK, { headers })
        ]);

        setSubmissions(subsRes.data);
        setFeedbacks(fbRes.data);
      } catch (e) {
        console.error('Error loading staff data:', e);
      }
    };

    fetchAll();
  }, [navigate]);

  const handleQuestionChange = (i, value) => {
    const opts = [...questionForm.options];
    opts[i] = value;
    setQuestionForm({ ...questionForm, options: opts });
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(API.QUESTIONS, questionForm, { headers });

      toast.success('Question added');
      setQuestionForm({ questionText: '', options: ['', '', '', ''], correctAnswer: '' });
    } catch (e) {
      console.error(e);
      toast.error('Failed to add question');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Staff Dashboard</h2>

      {/* Add Question */}
      <section className="my-4">
        <h4>Add Question</h4>
        <form onSubmit={submitQuestion} className="card card-body">
          <div className="mb-2">
            <label>Question Text</label>
            <input
              className="form-control"
              value={questionForm.questionText}
              onChange={e => setQuestionForm({ ...questionForm, questionText: e.target.value })}
              required
            />
          </div>

          {questionForm.options.map((opt, i) => (
            <div className="mb-2" key={i}>
              <label>Option {i + 1}</label>
              <input
                className="form-control"
                value={opt}
                onChange={e => handleQuestionChange(i, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="mb-2">
            <label>Correct Answer</label>
            <input
              className="form-control"
              value={questionForm.correctAnswer}
              onChange={e => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
              required
            />
          </div>

          <button className="btn btn-primary">Add Question</button>
        </form>
      </section>

      {/* Submissions */}
      <section className="my-4">
        <h4>All Submissions</h4>
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          submissions.map((s, idx) => (
            <div className="card my-2" key={idx}>
              <div className="card-body">
                <p><strong>User:</strong> {s.userId?.name} ,{s.userId?.email}</p>
                <p><strong>Status:</strong> {s.status} | <strong>Score:</strong> {s.score}/{s.totalQuestions}</p>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Feedback */}
      <section className="my-4">
        <h4>Feedback</h4>
        {feedbacks.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          feedbacks.map((f, i) => (
            <div className="card my-2" key={i}>
              <div className="card-body">
                <p><strong>{f.applicantId?.name ?? 'Unknown'}:</strong> {f.feedbackText}</p>
                <p>Status: <strong>{f.result}</strong></p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default StaffDashboard;
