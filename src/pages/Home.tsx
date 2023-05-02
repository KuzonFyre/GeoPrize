import { useNavigate } from "react-router-dom";
import {auth} from '../firebase'
export const Home = () => {
    const navigate = useNavigate();

    const logout = async () => {
        await auth.signOut()
        navigate("../login")
    }
    return (<div>
        <h1>
            GeoPrize Smart Contracts
        </h1>
        <div>
            <h3>
                Create and use contracts that award eth based on your location
            </h3>
            <button onClick={() => navigate("../create-contract")}>Create Contracts</button>
            <button onClick={() => navigate("/contracts")}>View Contracts for your eth address</button>
            <button onClick={logout}>Sign out</button>
        </div>
    </div>)
}