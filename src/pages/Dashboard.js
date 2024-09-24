import React from 'react';
import './Dashboard.css'; // Create a corresponding CSS file

const Dashboard = () => {
  // Example function for navigation or opening a details modal
  const handleViewDetails = (section) => {
    console.log(`Viewing details for: ${section}`);
    // You can navigate or trigger actions here
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/* Single Card for Inventory Summary and Sales Activity */}
        <div className="summary-activity-card">
          <div className="summary-section">
            <h4>Inventory Summary</h4>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Items</h3>
                <p>0</p>
                <button onClick={() => handleViewDetails('total-items')} className="view-details-btn">
                  View detail
                </button>
              </div>
              <div className="summary-card">
                <h3>Low-Stock Alerts</h3>
                <p>0</p>
                <button onClick={() => handleViewDetails('low-stock')} className="view-details-btn">
                  View detail
                </button>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="vertical-divider"></div>

          <div className="sales-section">
            <h4>Sales Activity</h4>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>To be delivered</h3>
                <p>0</p>
                <button onClick={() => handleViewDetails('to-be-delivered')} className="view-details-btn">
                  View detail
                </button>
              </div>
              <div className="summary-card">
                <h3>To be ordered</h3>
                <p>0</p>
                <button onClick={() => handleViewDetails('to-be-ordered')} className="view-details-btn">
                  View detail
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Plans and Warehouse Details */}
        <div className="inventory-plans">
          <div className="inventory-list">
            <h4>Inventory Plans</h4>
            <div className="plan">
              <span>[Urgent] T-Shirt Inventory</span>
              <span>0 product</span>
              <span className="status todo">Todo</span>
            </div>
            <div className="plan">
              <span>[Monthly] NOV Inventory - Warehouse A</span>
              <span>0 products</span>
              <span className="status processing">Processing</span>
            </div>
            <div className="plan">
              <span>[Monthly] OCT Inventory - Warehouse A</span>
              <span>0 products</span>
              <span className="status complete">Complete</span>
            </div>
          </div>

          <div className="warehouse-details">
            <h4>Warehouse Details</h4>
            <div className="pie-chart">
              {/* For the Pie Chart use a library like React Chart.js */}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="top-products">
          <h4>Top Selling Products</h4>
          <div className="product-list">
            <div className="product">
              <img src="/path-to-image.png" alt="product" />
              <p>Sneakers</p>
              <p>0 items sold</p>
            </div>
            <div className="product">
              <img src="/path-to-image.png" alt="product" />
              <p>Top Grade Shoes</p>
              <p>0 items sold</p>
            </div>
            <div className="product">
              <img src="/path-to-image.png" alt="product" />
              <p>Fashion Shoes</p>
              <p>0 items sold</p>
            </div>
            <div className="product">
              <img src="/path-to-image.png" alt="product" />
              <p>Apparels</p>
              <p>0 items sold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
