import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore instance
import { Line, Bar } from 'react-chartjs-2'; // Import Line and Bar charts from Chart.js
import 'chart.js/auto'; // Import necessary Chart.js components
import './Sales.css'; // Ensure you have the CSS for styling

const Sales = () => {
  const [sales, setSales] = useState([]); // State to hold all sales
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for deletion confirmation
  const [deleteId, setDeleteId] = useState(null); // To track which sale record to delete
  const [superAdminEmail, setSuperAdminEmail] = useState(''); // To store super admin email
  const [superAdminPassword, setSuperAdminPassword] = useState(''); // To store super admin password
  const [error, setError] = useState(''); // To show errors in modal

  const salesCollectionRef = collection(db, 'sales'); // Reference to 'sales' collection in Firestore

  // Fetch sales data from Firestore on component mount
  useEffect(() => {
    const fetchSales = async () => {
      const salesSnapshot = await getDocs(salesCollectionRef);
      const salesData = salesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setSales(salesData);
    };

    fetchSales();
  }, []);

  // Function to open the modal and set the record to delete
  const openDeleteModal = (id) => {
    setDeleteId(id); // Set the sale ID to delete
    setIsModalOpen(true); // Open the modal
  };

  // Function to handle the deletion of the sale
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'sales', deleteId)); // Delete the document from Firestore
      setSales((prevSales) => prevSales.filter(sale => sale.id !== deleteId)); // Remove from state
      setIsModalOpen(false); // Close the modal
      setError(''); // Clear any errors
    } catch (error) {
      setError('Failed to delete the sale. Please try again.');
    }
  };

  // Prepare the data for the sales bar chart (Sales Overview)
  const salesDates = sales.map(sale => sale.saleDate?.toDate().toLocaleDateString() || 'Unknown Date');
  const salesTotals = sales.map(sale => sale.total || 0);

  const barChartData = {
    labels: salesDates, // Dates of sales
    datasets: [
      {
        label: 'Sales Overview',
        data: salesTotals, // Total sales for each date
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Calculate total sales over the last 30 days
  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
  const lastWeekSales = sales.filter(sale => {
    const saleDate = sale.saleDate?.toDate();
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    return saleDate > oneWeekAgo;
  }).reduce((acc, sale) => acc + sale.total, 0);

  // Simulate percentage changes for demo purposes (you can use real calculation)
  const percentageChangeWeek = ((lastWeekSales - 5000) / 5000) * 100; // Example comparison
  const percentageChangeMonth = ((totalSales - 15000) / 15000) * 100;

  return (
    <div className="sales-page">
      <h1>Sales Overview</h1>

      {/* Chart Cards */}
      <div className="chart-cards">
        
        {/* Active Projects */}
        <div className="chart-card">
          <div className="chart-title">Active Products</div>
          <div className="chart-description">In last 30 days revenue from sales.</div>
          <div className="chart-data">₱{totalSales.toFixed(2)}</div>
          <div className="chart-stats">
            <span className={`percentage P{percentageChangeWeek >= 0 ? 'positive' : 'negative'}`}>
              {percentageChangeWeek >= 0 ? '↑' : '↓'} {Math.abs(percentageChangeWeek).toFixed(2)}% This Week
            </span>
            <span className={`percentage P{percentageChangeMonth >= 0 ? 'positive' : 'negative'}`}>
              {percentageChangeMonth >= 0 ? '↑' : '↓'} {Math.abs(percentageChangeMonth).toFixed(2)}% This Month
            </span>
          </div>
        </div>

        {/* Avg Subscriptions */}
        <div className="chart-card">
          <div className="chart-title">Avg Sales</div>
          <div className="chart-description">In last 30 days product trend.</div>
          <div className="chart-data">₱{totalSales.toFixed(2)}</div>
          <Line
            className="chart-container"
            data={{
              labels: salesDates,
              datasets: [
                {
                  label: 'Subscriptions',
                  data: salesTotals,
                  fill: true,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  tension: 0.1,
                },
              ],
            }}
          />
        </div>

        {/* Sales Overview */}
        <div className="chart-card">
          <div className="chart-title">Sales Overview</div>
          <div className="chart-description"></div>
          <div className="chart-data">₱{totalSales.toFixed(2)}</div>
          <Bar className="chart-container" data={barChartData} />
        </div>

      </div>

      {/* Sales Table */}
      <div className="sales-table">
      <h1>History</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Products</th>
              <th>Category</th>
              <th>Sale Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.id.substring(0, 4)}</td>
                  <td>
                    {sale.products && sale.products.map((product, index) => (
                      <div key={index}>
                        {product.name || 'Unknown Product'} {/* Display product name */}
                      </div>
                    ))}
                  </td>
                  <td>
                    {sale.products && sale.products.map((product, index) => (
                      <div key={index}>
                        {product.category} {/* Display product category */}
                      </div>
                    ))}
                  </td>
                  <td>{sale.saleDate?.toDate().toLocaleDateString() || 'N/A'}</td> {/* Display sale date */}
                  <td>₱{sale.total || '0.00'}</td> {/* Display total */}
                  <td>{sale.status}</td> {/* Display status */}
                  <td>
                    <button onClick={() => openDeleteModal(sale.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No sales available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Super Admin Confirmation */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>This action requires super admin credentials.</p>
            <div className="modal-section">
              <label>Super Admin Email</label>
              <input
                type="email"
                value={superAdminEmail}
                onChange={(e) => setSuperAdminEmail(e.target.value)}
                placeholder="Enter super admin email"
              />
            </div>
            <div className="modal-section">
              <label>Super Admin Password</label>
              <input
                type="password"
                value={superAdminPassword}
                onChange={(e) => setSuperAdminPassword(e.target.value)}
                placeholder="Enter super admin password"
              />
            </div>

            {error && <p className="error">{error}</p>}

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="delete-btn" onClick={handleDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
