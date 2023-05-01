import React, { useEffect } from 'react'
import { useState } from "react";
import {db,auth} from '../firebase'
import { useNavigate, useParams} from "react-router-dom";
import {collection, doc, setDoc,getDoc} from "firebase/firestore";


export const Contracts = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([] as Contract[]);

  useEffect(() => {
    getContracts();
  }, []);
  type Contract = {
    to: string;
    from: string;
    address: string;
  };
  const  getContracts = async () => {
    if(auth.currentUser != null){
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if(userData && userData.contracts){
          setContracts(userData.contracts);
        }
    }
  }
}


  return (
    <div>
      <h1>Contracts</h1>
      <div>
        <ul>
        {contracts.length > 0 && contracts && contracts.map((contract) => (
            <li key={contract.address}>
              <div onClick={() => navigate("../contract/" + contract.address)}>
                Address: {contract.address}
                To: {contract.to}
                From: {contract.from}
              </div>
            </li>
            ))}
        </ul>
    </div>
    </div>
  );

};

