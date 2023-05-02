import React, { useEffect } from 'react'
import { useState } from "react";
import {db,auth} from '../firebase'
import {collection, doc,getDoc, getDocs} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";


export const Contracts = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([] as Contract[]);
  const [user,loading,error] = useAuthState(auth);
    useEffect(() => {
      if(loading) return;
      if (!user) return navigate("/login");
      getContracts();
    }, [user,loading]);
  type Contract = {
    to: string;
    from: string;
    address: string;
  };

async function getContracts() {
  const contractsCollection = collection(db, "contracts");
  const contractsSnapshot = await getDocs(contractsCollection);
  contractsSnapshot.forEach(async (contractDoc) => {
    const contractData = contractDoc.data();
    if(auth.currentUser != null){
    const userDoc = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();
    console.log(userData?.address);
    console.log(contractData.to);
    console.log(contractData.to === userData?.address);

    if (userData && contractData && contractData.to === userData.address) {

      setContracts((li) => [...li,{
        to: contractData.to,
        from: contractData.from,
        address: contractData.address,
      } as Contract]);
    }
  }
  }
  );
  console.log(contracts);
}


  return (
    <div>
      <h1>Contracts</h1>
      <div>
        <ul>
        {contracts.length > 0 && contracts && contracts.map((contract) => (
            <li key={contract.address}>
              <div onClick={() => navigate("../contract/" + contract.address + "/")}>
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

