import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Import Firestore instance
import './Products.css';  // Ensure you have your CSS for styling

const Products = () => {
  const [products, setProducts] = useState([]);  // State to hold all products
  const [newProduct, setNewProduct] = useState({ name: '', category: '', color: '', price: 0, size: '', stock: 0, description: '', imageUrl: '', subCategory: '' });  // New product form state
  const [editProduct, setEditProduct] = useState(null);  // Product being edited
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to toggle modal
  const [currentStep, setCurrentStep] = useState(1);  // State to handle the current step in the modal
  const [imagePreview, setImagePreview] = useState(null);  // Image preview for the modal

  const productsCollectionRef = collection(db, 'products');  // Reference to 'products' collection in Firestore

  // Fetch products from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const productsSnapshot = await getDocs(productsCollectionRef);
      setProducts(productsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchProducts();
  }, []);

  // Handle image file change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewProduct((prevProduct) => ({
          ...prevProduct,
          imageUrl: event.target.result,  // Update image URL in the product state
        }));
        setImagePreview(event.target.result);  // Preview the image
      };
      reader.readAsDataURL(file);  // Convert file to base64 URL for preview
    }
  };

  // Create a new product
  const addProduct = async () => {
    // Validate all fields before submitting
    if (!newProduct.name || !newProduct.description || !newProduct.category || 
        !newProduct.color || !newProduct.price || !newProduct.size || 
        !newProduct.stock || !newProduct.imageUrl || !newProduct.subCategory) {
      alert('Please fill out all required fields');
      return;
    }

    try {
      // Submit the product to Firestore
      await addDoc(productsCollectionRef, {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Reset form after successful submission
      setNewProduct({
        name: '', category: '', color: '', price: 0, size: '', stock: 0,
        description: '', imageUrl: '', subCategory: ''
      });
      setIsModalOpen(false);  // Close modal
      setImagePreview(null);  // Clear image preview
    } catch (error) {
      console.error("Error adding product:", error);
    }
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

  // Handle step navigation
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
            <button className="modal-close" onClick={toggleModal}>&times;</button>
            <h2>Create New Product</h2>

            {/* Step navigation */}
            <div className="modal-steps">
              <div className={`step ${currentStep === 1 ? 'active-step' : ''}`}>
                <div className="step-icon">1</div> General
              </div>
              <span className="arrow">&rarr;</span>
              <div className={`step ${currentStep === 2 ? 'active-step' : ''}`}>
                <div className="step-icon">2</div> Specified
              </div>
              <span className="arrow">&rarr;</span>
              <div className={`step ${currentStep === 3 ? 'active-step' : ''}`}>
                <div className="step-icon">3</div> Price & Stock
              </div>
            </div>

            {/* Step 1: General */}
            {currentStep === 1 && (
              <div>
                <div className="modal-section">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="modal-section">
                  <label>Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>

                {/* Image URL Field */}
                <div
                  className="modal-section file-upload"
                  onClick={() => document.getElementById("fileInput").click()}
                  style={{ cursor: 'pointer' }}
                >
                  <label>Upload Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  <div className="upload-box">
                    <p>Drag your images here, or <span className="browse-link">Click to browse</span></p>
                    <p className="image-note">Add image to your product. Used to represent your product.</p>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && <img src={imagePreview} alt="Product Preview" width="200" />}
                </div>

                <button className="submit-btn" onClick={nextStep}>Next</button>
              </div>
            )}

            {/* Step 2: Specified */}
            {currentStep === 2 && (
              <div>
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
                  <label>Sub-Category</label>
                  <input
                    type="text"
                    value={newProduct.subCategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                  />
                </div>
                <div className="modal-buttons">
                  <button className="cancel-btn" onClick={prevStep}>Previous</button>
                  <button className="submit-btn" onClick={nextStep}>Next</button>
                </div>
              </div>
            )}

            {/* Step 3: Price & Stock */}
            {currentStep === 3 && (
              <div>
                <div className="modal-section">
                  <label>Price</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                <div className="modal-buttons">
                  <button className="cancel-btn" onClick={prevStep}>Previous</button>
                  <button className="submit-btn" onClick={addProduct}>Save</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
                {/* Display only the first 4 characters of the document ID */}
                <td>{product.id.substring(0, 4)}</td>
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
