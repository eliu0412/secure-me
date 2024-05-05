'use client';

import axios from 'axios';
import React, {useState} from 'react';
import { signIn} from 'next-auth/react';
import { useSession } from 'next-auth/react';


export default function Register() {

    const {update} = useSession();

    const[loginName, setLoginName] = useState('');
    const[loginPassword, setLoginPassword] = useState('');

    const[registerName, setRegisterName] = useState('');
    const[registerPassword, setRegisterPassword] = useState('');

    const register = () => {
        axios({
            method: 'post',
            data:{
                username: registerName,
                password: registerPassword
            },
            withCredentials: true,
            url: 'http://localhost:3001/register'
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const login = async() => {
        try {
            await signIn('credentials', {
                username: loginName,
                password: loginPassword,
                redirect: false
            });
        }catch(err){
            console.log(error);
        }
    }

    return (
        <div>
            <div>
            <h1>Login</h1>
            <input type="text" name="username" placeholder="Username"
                onChange={e => setLoginName(e.target.value)}></input>
            <input type="password" name="password" placeholder="Password"
                onChange={e => setLoginPassword(e.target.value)}></input>
            <button onClick={login}>Login</button>
            </div>

            <div>
            <h1>Register</h1>
            <input type="text" name="username" placeholder="Username"
                    onChange={e => setRegisterName(e.target.value)}></input>
            <input type="password" name="password" placeholder="Password"
                    onChange={e => setRegisterPassword(e.target.value)}></input>
            <button onClick={register}>Register</button>
            </div>
        </div>
    );
}