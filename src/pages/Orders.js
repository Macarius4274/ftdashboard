import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Firestore instance

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollectionRef = collection(db, 'users');  // Path to users collection
      const ordersSnapshot = await getDocs(ordersCollectionRef);
      const ordersData = ordersSnapshot.docs.map(doc => doc.data());
      setOrders(ordersData);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            Order ID: {order.id}, Total: {order.totalAmount}, Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
