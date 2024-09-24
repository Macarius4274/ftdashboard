import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Firestore instance

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const paymentsCollectionRef = collection(db, 'users/orders/payments');  // Adjust path as needed
      const paymentsSnapshot = await getDocs(paymentsCollectionRef);
      const paymentsData = paymentsSnapshot.docs.map(doc => doc.data());
      setPayments(paymentsData);
    };
    fetchPayments();
  }, []);

  return (
    <div>
      <h1>Payments</h1>
      <ul>
        {payments.map(payment => (
          <li key={payment.transactionId}>
            Payment ID: {payment.transactionId}, Amount: {payment.amountPaid}, Status: {payment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;
