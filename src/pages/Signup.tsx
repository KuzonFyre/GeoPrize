import {useState} from 'react'
import {db,auth} from '../firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { useNavigate} from "react-router-dom";
import {doc, setDoc} from "firebase/firestore";

export const Signup = () => {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAdress] = useState("");


    
    async function signup() {
        setShowError(false);
        if (
            firstName === "" ||
            lastName === "" ||
            email === "" ||
            password === ""
        ) {
            setShowError(true);
            return;
        }
        
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        if(user != null){
        const docRef = doc(db, "users",user.uid);
        // getDoc(docRef)).exists() ? console.log("exists") : console.log("does not exist");
        setDoc(docRef, {address, contracts: {}, isAdmin: true});
    
        }
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
      navigate('/', {replace: true})

    }

    return (
        <div>
            <h1>Sign Up</h1>
            <div>
                <input 
                    type="text" 
                    placeholder="First Name" 
                    value={firstName} 
                    onChange={evt => setFirstName(evt.target.value)}
                ></input>
                <input 
                    type="text" 
                    placeholder="Last Name"
                    value={lastName}
                    onChange={evt => setLastName(evt.target.value)}
                ></input>
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={evt => setEmail(evt.target.value)}
                ></input>
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={evt => setPassword(evt.target.value)}
                ></input>
                <input 
                    type="text" 
                    placeholder="eth address"
                    value={address}
                    onChange={evt => setAdress(evt.target.value)}
                ></input>
            </div>
            <div>
                <button onClick={signup}>Signup</button>
            </div>
            <div>
            <button 
                onClick={() => {navigate('../login/', {replace: true})}}
                >
                    Have an account? Login here.
                </button>
            </div>
            <div className={
                showError ? 'visible' : 'hidden'
            }>
            </div>
        </div>
    )
}