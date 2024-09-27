import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './Dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]); // State for all products
  const [purchases, setPurchases] = useState([]); // State for purchases
  const [lowStockProducts, setLowStockProducts] = useState([]); // Products with low stock
  const [topSellingProducts, setTopSellingProducts] = useState([]); // Top selling products
  const [totalItems, setTotalItems] = useState(0); // Total number of items
  const [toBeDelivered, setToBeDelivered] = useState(0); // Sales to be delivered
  const [toBeOrdered, setToBeOrdered] = useState(0); // Orders to be placed
  const [totalSales, setTotalSales] = useState(0); // Total sales amount
  const [todaySales, setTodaySales] = useState(0); // Sales for today
  const [warehouseStock, setWarehouseStock] = useState({}); // Stock per category/warehouse

  // Fetch products and purchases data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const purchasesSnapshot = await getDocs(collection(db, 'purchases'));

      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const purchasesList = purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Update the state
      setProducts(productsList);
      setPurchases(purchasesList);

      // Calculate total items and low-stock alerts
      setTotalItems(productsList.length);
      setLowStockProducts(productsList.filter(product => product.stock <= 5));

      // Calculate total sales amount
      const totalSalesAmount = purchasesList.reduce((acc, purchase) => {
        return acc + (purchase.total || 0);
      }, 0);
      setTotalSales(totalSalesAmount);

      // Calculate today's sales
      const today = new Date();
      const todaySalesAmount = purchasesList.reduce((acc, purchase) => {
        const purchaseDate = purchase.saleDate?.toDate();
        if (
          purchaseDate &&
          purchaseDate.getFullYear() === today.getFullYear() &&
          purchaseDate.getMonth() === today.getMonth() &&
          purchaseDate.getDate() === today.getDate()
        ) {
          acc += purchase.total || 0;
        }
        return acc;
      }, 0);
      setTodaySales(todaySalesAmount);

      // Calculate pending deliveries and orders
      setToBeDelivered(purchasesList.filter(purchase => purchase.status === 'to-be-delivered').length);
      setToBeOrdered(purchasesList.filter(purchase => purchase.status === 'to-be-ordered').length);

      // Calculate stock per category (for warehouse details)
      const warehouseStockMap = productsList.reduce((acc, product) => {
        const category = product.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += product.stock || 0;
        return acc;
      }, {});
      setWarehouseStock(warehouseStockMap);
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/* Inventory Summary and Sales Activity */}
        <div className="summary-activity-card">
          <div className="summary-section">
            <h4>Inventory Summary</h4>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Items</h3>
                <p>{totalItems}</p>
              </div>
              <div className="summary-card">
                <h3>Low-Stock Alerts</h3>
                <p>{lowStockProducts.length}</p>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="vertical-divider"></div>

          {/* Enhanced Sales Activity Section */}
          <div className="sales-section">
            <h4>Sales Activity</h4>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Sales</h3>
                <p>₱{totalSales.toFixed(2)}</p> {/* Display total sales amount in Pesos */}
              </div>
              <div className="summary-card">
                <h3>Sales Today</h3>
                <p>₱{todaySales.toFixed(2)}</p> {/* Display today's sales in Pesos */}
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
              <span>{totalItems} products</span>
              <span className="status processing">Processing</span>
            </div>
            <div className="plan">
              <span>[Monthly] OCT Inventory - Warehouse A</span>
              <span>{totalItems} products</span>
              <span className="status complete">Complete</span>
            </div>
          </div>

          {/* Enhanced Warehouse Details Section */}
          <div className="warehouse-details">
            <h4>Warehouse Stock by Category</h4>
            <div className="warehouse-stats">
              {Object.keys(warehouseStock).map(category => (
                <div key={category} className="warehouse-category">
                  <span>{category}</span>
                  <br></br>
                  <br></br>
                  <span>{warehouseStock[category]} items</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="top-products">
          <h4>Top Selling Products</h4>
          <div className="product-list">
            {topSellingProducts.map(product => (
              <div className="product" key={product.id}>
                <img src={product.imageUrl} alt={product.name} />
                <p>{product.name}</p>
                <p>{product.sold} items sold</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stock List */}
        <div className="stock-list">
          <h4>Product Stocks</h4>
          <table className="stock-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
