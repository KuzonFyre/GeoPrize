import {useState} from 'react'
import {auth} from '../firebase'
import {signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigate} from "react-router-dom";
import { useApi } from "../hooks/useApi";

export const Login = () => {
    const navigate = useNavigate();
    const api  = useApi();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function login(){
        if(email === '' || password === ''){
            console.log('Please fill out all fields')
            return
        }
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user.email)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
        let result = await api.post("/sessions", {email, password})
        navigate('../contracts/', {replace: true})

    }
    return (
        <div>
            <h1>Login</h1>
            <div>
            <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                ></input>
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                ></input>
            </div>
            <div>
                <button onClick={login}>Login</button>
            </div>
            <div>
                <button 
                onClick={() => {navigate('../signup/', {replace: true})}}
                >
                    No account? Signup here
                </button>
            </div>
            <div>
                <h4>Login Error!</h4>
            </div>
        </div>
    )
}