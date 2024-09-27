import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore instance
import './Purchase.css'; // Ensure you have the CSS for styling

const Purchases = () => {
  const [purchases, setPurchases] = useState([]); // State to hold all purchases
  const [waitingList, setWaitingList] = useState([]); // Waiting list state

  const purchasesCollectionRef = collection(db, 'purchases'); // Reference to 'purchases' collection in Firestore
  const salesCollectionRef = collection(db, 'sales'); // Reference to 'sales' collection in Firestore
  const productsCollectionRef = collection(db, 'products'); // Reference to 'products' collection in Firestore

  // Fetch purchases from Firestore on component mount
  useEffect(() => {
    const fetchPurchases = async () => {
      const purchasesSnapshot = await getDocs(purchasesCollectionRef);
      setPurchases(purchasesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchPurchases();
  }, []);

  // Generate a random 4-character alphanumeric ID
  const generateID = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  // Update product stock in Firestore
  const updateProductStock = async (productId, quantity) => {
    const productDoc = doc(db, 'products', productId);
    const productSnapshot = await getDocs(productsCollectionRef);
    const productData = productSnapshot.docs.find(doc => doc.id === productId).data();

    // Deduct the quantity from the stock
    const newStock = productData.stock - quantity;

    // Update stock in Firestore
    await updateDoc(productDoc, {
      stock: newStock >= 0 ? newStock : 0 // Ensure stock doesn't go negative
    });
  };

  // Handle Confirm Order, move to waiting list and deduct stock
  const handleConfirmOrder = async (id) => {
    const purchaseDoc = doc(db, 'purchases', id);
    const confirmedOrder = purchases.find(order => order.id === id);
    
    // Deduct stock for each product in the purchase
    for (const product of confirmedOrder.products) {
      await updateProductStock(product.id, product.quantity); // Deduct stock based on product ID and ordered quantity
    }

    // Move order to waiting list and remove from purchases
    setWaitingList(prevList => [...prevList, confirmedOrder]);
    setPurchases(prevPurchases => prevPurchases.filter(order => order.id !== id));
    
    await updateDoc(purchaseDoc, {
      status: 'Waiting for Payment',
      id: generateID(),
    });
  };

  // Handle moving from waiting list to sales collection when payment is confirmed
  const handlePaymentReceived = async (id) => {
    const purchaseDoc = doc(db, 'purchases', id);
    const paidOrder = waitingList.find(order => order.id === id);

    // Add the order to the 'sales' collection
    await addDoc(salesCollectionRef, {
      ...paidOrder,
      status: 'Paid', // Update status to 'Paid'
      saleDate: new Date(), // Add the current date as the sale date
    });

    // Remove from Firestore purchases collection
    await deleteDoc(purchaseDoc);

    // Remove from UI waiting list
    setWaitingList(prevList => prevList.filter(order => order.id !== id));
  };

  // Handle cancel order from purchases list
  const handleCancelOrder = async (id) => {
    const purchaseDoc = doc(db, 'purchases', id);

    // Delete document from Firestore
    await deleteDoc(purchaseDoc);

    // Remove from UI list
    setPurchases(prevPurchases => prevPurchases.filter(order => order.id !== id));
  };

  // Handle cancel order from waiting list
  const handleCancelOrderWaitingList = async (id) => {
    const purchaseDoc = doc(db, 'purchases', id);

    // Delete document from Firestore
    await deleteDoc(purchaseDoc);

    // Remove from waiting list in UI
    setWaitingList(prevList => prevList.filter(order => order.id !== id));
  };

  return (
    <div className="purchases-page">
      <h1>Manage Purchases</h1>

      {/* Purchases Table */}
      <div className="purchase-table">
        <h2>Confirmed Orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Payment Method</th>
              <th>Products</th>
              <th>Purchase Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <tr key={purchase.id}>
                <td>{purchase.id.substring(0, 4)}</td>
                <td>{purchase.name}</td>
                <td>{purchase.contact}</td>
                <td>{purchase.paymentMethod}</td>
                <td>
                  {purchase.products.map((product, index) => (
                    <div key={index}>
                      {product.category}: {product.id} (x{product.quantity})
                    </div>
                  ))}
                </td>
                <td>{purchase.purchaseDate.toDate().toLocaleDateString()}</td>
                <td>P{purchase.total}</td>
                <td>{purchase.status}</td>
                <td>
                  <button onClick={() => handleConfirmOrder(purchase.id)}>Confirm Order</button>
                  <button onClick={() => handleCancelOrder(purchase.id)}>Cancel Order</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Waiting List Table */}
      <div className="waiting-list-table">
        <h2>Waiting for Payment</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Payment Method</th>
              <th>Products</th>
              <th>Purchase Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {waitingList.map(purchase => (
              <tr key={purchase.id}>
                <td>{purchase.id.substring(0, 4)}</td>
                <td>{purchase.name}</td>
                <td>{purchase.contact}</td>
                <td>{purchase.paymentMethod}</td>
                <td>
                  {purchase.products.map((product, index) => (
                    <div key={index}>
                      {product.category}: {product.id} (x{product.quantity})
                    </div>
                  ))}
                </td>
                <td>{purchase.purchaseDate.toDate().toLocaleDateString()}</td>
                <td>P{purchase.total}</td>
                <td>{purchase.status}</td>
                <td>
                  <button onClick={() => handlePaymentReceived(purchase.id)}>Payment Received</button>
                  <button onClick={() => handleCancelOrderWaitingList(purchase.id)}>Cancel Order</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;
