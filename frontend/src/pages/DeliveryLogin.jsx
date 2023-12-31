import React, { useState } from 'react';
import './login.css';
import { useDispatch } from 'react-redux';
import { saveUser } from '../userslice';
import {postData} from '../http-post-service';
import { useNavigate } from 'react-router-dom';
import { setAuthToken, setLoggedIn, setisAdmin } from '../loginSlice';
import { addAllproducts } from '../cartslice';


export default function Login() {
  const navigate = useNavigate();
const dispatch = useDispatch();
const defaultUser = { "email": "", "password": "" }
 
  const [userData, setuserData] = useState(defaultUser);

  const handleData = (column, e) => {
    setuserData((data) => ({
      ...data,
      [column]: e.target.value
    }))
  }
  const handledeliveryLogin = async () => {
    const response = await postData("/delivery/deliverylogin", JSON.stringify(userData))
    if (response.message == "Delivery Auth successful") {
      setuserData(defaultUser)
      dispatch(saveUser(response.userDetails))
      dispatch(setLoggedIn(true))
      dispatch(setAuthToken(response.token))
      localStorage.setItem("userLoggedIn", true);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userType", 'Delivery');
      localStorage.setItem("name",response.userDetails.lastName + " "+ response.userDetails.firstName)
      navigate("/delivery/dashboard");
    }
    else {
      console.error(response)
      setuserData(defaultUser)
    }
  }
   
  

  return (
    <div className='login-container'>
      <h3 className='center'><u>Delivery-Login</u></h3>

      <div className="form-group">
        <label htmlFor="email" className="head">Email</label>
        <input type="email" className="form-control-item-lists" id="email" onChange={(e) => handleData('email', e)} />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="head">Password</label>
        <input type="password" className="form-control-item-lists" id="password" onChange={(e) => handleData('password', e)} />
      </div>
      <button type="submit" className="btn-color" onClick={handledeliveryLogin}>Login</button>

    </div>

  )
  }