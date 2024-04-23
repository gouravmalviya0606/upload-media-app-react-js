import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../service/ApiService';
import { ToastContainer, toast } from 'react-toastify';
const Login = () => {

    const [loginDetails,setLoginDetails] = useState({
      email: '',
      password: '',
    });
    const [validationError,setValidationError] = useState({});
    const [flag,setFlag] = useState(false);

    let navigate = useNavigate();

    
    const handleChange = (e) => {
      setLoginDetails((prov)=>{
        return {
          ...prov,
          [e.target.name] : e.target.value
        }
      })
    }
    
    const validateForm = () => {
      return new Promise((resolve, reject) => {
        let error = [];
        Object.keys(loginDetails).forEach(fields=>{
          if(loginDetails[fields] === '' ){
            error[fields] = `${fields} is required`;
          }
          else{
            delete error[fields]
          }
        })
  
  
        if(loginDetails['email'] && !loginDetails['email'].toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )){
          error['email'] = 'invalid email';
        }
  
        setValidationError(error);

        if(Object.keys(error).length === 0){
          resolve();
        }else{
          reject(error);
        }
      })
    }

    const loginSubmit = async () => {
      try{
        await validateForm();
        const res = await login(loginDetails);
        if(res['data']['status'] == 200){

          setLoginDetails({
            email:"",
            password:""
          });
          if(res['data']['login']){
            setFlag(true);
            navigate('/home');
            toast.success('login successfully');
            localStorage.setItem('MYAppToken', res['data']['token']);
          }
          else{
            toast.error('invalid email and password');
          }
        }
      }
      catch(error){
        console.log(error);
      }
    }

    return (
      <>
      <ToastContainer />
      <h1>Login</h1>
      <div className='signupForm'>
        
        <label htmlFor="email"> Email </label>
        <input type="text" name="email" id="email" onChange={(e)=>{ handleChange(e) }}/>
        <p>{ validationError['email'] }</p>
        
        <label htmlFor="password"> Password </label>
        <input type="password" name="password" id="password" onChange={(e)=>{ handleChange(e) }}/>
        <p>{ validationError['password'] }</p>

      </div>
      <button className="signupButton" type="button" onClick={()=>{ loginSubmit() }}> Login </button> <a className="loginHref" onClick={()=>{ navigate('/') }}> sign up </a>
      {/* {true && <Toaster msg={'user login successfully'} status={true}/>} */}
     </>
    )
  }
export default Login