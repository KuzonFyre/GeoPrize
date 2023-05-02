import { useNavigate } from "react-router-dom";
export const Home = () => {
    const navigate = useNavigate();

    return (<div>
        <h1>
            GeoPrize Smart Contracts
        </h1>
        <div>
            <h3>
                Create and use contracts that award eth based on your location
            </h3>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
            <button onClick={() => navigate("/login")}>Login</button>
        </div>
    </div>)
}