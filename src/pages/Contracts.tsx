import React, { useEffect } from 'react'
import { useState } from "react";
import {db,auth} from '../firebase'
import { useNavigate} from "react-router-dom";
import {collection, doc, setDoc,getDoc, getDocs} from "firebase/firestore";


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
//   const  getContracts = async () => {
//     console.log(auth.currentUser)
//     if(auth.currentUser != null){
//       const userDoc = doc(db, "users", auth.currentUser.uid);
//       const userSnap = await getDoc(userDoc);
//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         if(userData && userData.contracts){
//           setContracts(userData.contracts);
//         }
//     }
//   }
// }

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
  // setContracts(contracts);
}


  return (
    <div>
      <h1>Contracts</h1>
      <div>
        <ul>
        {contracts.length > 0 && contracts && contracts.map((contract) => (
            <li key={contract.address}>
              <div onClick={() => navigate("../contract/" + contract.address + "/" + contract.to + "/" + contract.from)}>
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

