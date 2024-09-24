import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Import Firestore instance
import './Products.css';  // Ensure you have your CSS for styling

const Products = () => {
  const [products, setProducts] = useState([]);  // State to hold all products
  const [newProduct, setNewProduct] = useState({ name: '', category: '', color: '', price: 0, size: '', stock: 0, description: '', imageUrl: '', subCategory: '' });  // New product form state
  const [editProduct, setEditProduct] = useState(null);  // Product being edited
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to toggle modal

  const productsCollectionRef = collection(db, 'products');  // Reference to 'products' collection in Firestore

  // Fetch products from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const productsSnapshot = await getDocs(productsCollectionRef);
      setProducts(productsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchProducts();
  }, []);

  // Create a new product
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert('Please fill out all required fields');
      return;
    }

    await addDoc(productsCollectionRef, {
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setNewProduct({ name: '', category: '', color: '', price: 0, size: '', stock: 0, description: '', imageUrl: '', subCategory: '' });  // Reset form
    setIsModalOpen(false);  // Close modal
  };

  // Update an existing product
  const updateProduct = async (id) => {
    const productDoc = doc(db, 'products', id);
    await updateDoc(productDoc, {
      ...editProduct,
      price: Number(editProduct.price),
      stock: Number(editProduct.stock),
      updatedAt: new Date(),
    });
    setEditProduct(null);  // Exit edit mode
  };

  // Delete a product
  const deleteProduct = async (id) => {
    const productDoc = doc(db, 'products', id);
    await deleteDoc(productDoc);
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="products-page">
      <h1>Manage Products</h1>

      {/* Add New Product Button */}
      <button onClick={toggleModal} className="add-product-btn">
        Create New Product
      </button>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Product</h2>

            {/* Fields for adding a new product */}
            <div className="modal-section">
              <label>Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            <div className="modal-section">
              <label>Category</label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
            </div>

            <div className="modal-section">
              <label>Color</label>
              <input
                type="text"
                value={newProduct.color}
                onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
              />
            </div>

            <div className="modal-section">
              <label>Price</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>

            <div className="modal-section">
              <label>Size</label>
              <input
                type="text"
                value={newProduct.size}
                onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
              />
            </div>

            <div className="modal-section">
              <label>Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </div>

            <div className="modal-section">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>

            <div className="modal-section">
              <label>Image URL</label>
              <input
                type="text"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
              />
            </div>

            <div className="modal-section">
              <label>Sub-Category</label>
              <input
                type="text"
                value={newProduct.subCategory}
                onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
              />
            </div>

            <button onClick={addProduct} className="submit-btn">Save</button>
            <button onClick={toggleModal} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Category</th>
              <th>Color</th>
              <th>Created At</th>
              <th>Description</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Size</th>
              <th>Stock</th>
              <th>Sub-Category</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.category}</td>
                <td>{product.color}</td>
                <td>{product.createdAt?.toDate().toLocaleDateString()}</td>
                <td>{product.description}</td>
                <td>
                  <img src={product.imageUrl} alt={product.name} width="50" />
                </td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.size}</td>
                <td>{product.stock}</td>
                <td>{product.subCategory}</td>
                <td>{product.updatedAt?.toDate().toLocaleDateString()}</td>
                <td>
                  {editProduct && editProduct.id === product.id ? (
                    <button onClick={() => updateProduct(product.id)}>Save</button>
                  ) : (
                    <button onClick={() => setEditProduct(product)}>Edit</button>
                  )}
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
