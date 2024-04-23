import React,{useEffect} from 'react'
import { BrowserRouter, Routes,Route,
  Navigate,Outlet } from 'react-router-dom'
import SignUp from '../pages/SignUp'
import Login from '../pages/Login'
import Home from '../pages/Home'

const Navigator = () => {

  const PrivateWrapper = () => {
    const token = localStorage.getItem('MYAppToken');
    console.log(token);
    if(!token){
        return <Navigate to="/login" />
      }
      else{
        return <Outlet />
      }
  };

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <SignUp /> } />
                <Route path="/login" element={ <Login /> } />
                <Route element={ <PrivateWrapper /> }>
                  <Route path="/home" element={ <Home /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default Navigator