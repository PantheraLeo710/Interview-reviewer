import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../config';
import jwt_decode from 'jwt-decode';

const Signup = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await axios.post(API.AUTH.SIGNUP, values);
      const { token } = res.data;
      localStorage.setItem('token', token);

      const decoded = jwt_decode(token);
      toast.success('Signup successful!');
      navigate('/login');


      // TODO: Optional - notify global auth context here
      // setAuthUser(decoded);

      if (decoded.isStaff) {
        navigate('/staff-dashboard');
      } else {
        navigate('/questions');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Signup failed';

      if (err.response?.status >= 400) {
        setErrors({ email: errorMsg });
        toast.error(errorMsg); 
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div className="col-md-4 shadow p-4 rounded">
        <h2 className="text-center mb-4">Signup</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label>Name</label>
                <Field type="text" name="name" className="form-control" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <Field type="email" name="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <Field type="password" name="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'Signup'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
