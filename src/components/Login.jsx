/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

// import firebase utilities
import { signIn, register, setupNotification } from '../firebase/firebase';

//import others
import loginIcon from '../assets/iconWeather.png'

const Login = () => {
    const navigate = useNavigate();

    const [registering, setRegistering] = useState(false)

    const fAuth = async (e) => {
        e.preventDefault();
        const mail = e.target.email.value;
        const psw = e.target.password.value;

        if (registering) {
            try {
                await register(mail, psw)
                toast.success('You have successfully registered, you can now log in')
                setRegistering(false)
            } catch (error) {
                toast.error("The password must have more than 8 characters")
            }
        }
        else {
            try {
                await signIn(mail, psw)
                navigate('/', { replace: true })
                toast.success('Successful login')
                setupNotification();
            } catch (error) {
                toast.error("The email or the password are not correct")
            }
        }
    }

    return (
        <div className='container'>
            <div className="row text-center">
                <div className="col-md-8">
                    <img src={loginIcon} alt="" className='image-size' />
                </div>

                <div className="col-md-4">
                    <div className="father">
                        <div className="card card-body shadow-lg">
                            <form onSubmit={fAuth}>
                                <input type="text" placeholder='Enter Email' className='textbox' id='email' />
                                <input type='password' placeholder='Enter Password' className='textbox' id='password' />
                                <button className='btnform'>{registering ? "Register" : "Sign In"}</button>
                            </form>
                            <h4 className='text'>{registering ? "If you already have an account" : "If you don't have an account"}</h4><button className='btnswitch' onClick={() => setRegistering(!registering)}>{registering ? "Sign In" : "Register"}</button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Login;