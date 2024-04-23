import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../service/ApiService';
import { ToastContainer, toast } from 'react-toastify';
const SignUp = () => {
  const [signupDetails, setSignupDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    conPassword: ''
  });
  const [validationError, setValidationError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignupDetails(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  const validateForm = () => {
    return new Promise((resolve, reject) => {
      const error = {};
      Object.keys(signupDetails).forEach(field => {
        if (signupDetails[field] === '') {
          error[field] = `${field} is required`;
        } else {
          delete error[field];
        }
      });

      if (signupDetails.conPassword !== '' && signupDetails.password !== signupDetails.conPassword) {
        error.conPassword = 'Password and confirm password do not match';
      }

      if (signupDetails.email && !signupDetails.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        error.email = 'Invalid email';
      }

      setValidationError(error);

      if (Object.keys(error).length === 0) {
        resolve(); // No errors, form is valid
      } else {
        reject(error); // Errors found, reject with error object
      }
    });
  }

  const submitForm = async () => {
    try {
      await validateForm();
      const res = await signUp(signupDetails);
      if (res.data.status === 200) {
        toast.success('signup successfully');
        // Reset form fields after successful signup
        setSignupDetails({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          conPassword: ''
        });
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  }

  return (
    <>
    <h1>Sign Up</h1>
    <div className='signupForm'>

      <label htmlFor="firstName"> First Name </label>
      <input type="text" name="firstName" id="firstName" value={ signupDetails['firstName'] } onChange={(e)=>{ handleChange(e) }}/>
      <p>{ validationError['firstName'] }</p>
      
      <label htmlFor="lastName"> Last Name </label>
      <input type="text" name="lastName" id="lastName" value={ signupDetails['lastName'] } onChange={(e)=>{ handleChange(e) }}/> 
      <p>{ validationError['lastName'] }</p>
      
      <label htmlFor="email"> Email </label>
      <input type="text" name="email" id="email" value={ signupDetails['email'] } onChange={(e)=>{ handleChange(e) }}/>
      <p>{ validationError['email'] }</p>
      
      <label htmlFor="password"> Password </label>
      <input type="password" name="password" id="password" value={ signupDetails['password'] } onChange={(e)=>{ handleChange(e) }}/>
      <p>{ validationError['password'] }</p>
      
      <label htmlFor="conPassword"> Conform Password </label>
      <input type="text" name="conPassword" id="conPassword" value={ signupDetails['conPassword'] } onChange={(e)=>{ handleChange(e) }}/>
      <p>{ validationError['conPassword'] }</p>
      
    </div>
    <button className="signupButton" type="button" onClick={ ()=>{ submitForm() } }> Sign up </button> <a className="loginHref" onClick={()=>{ navigate('/login') }}> Login </a>
   </>
  )
}

export default SignUp