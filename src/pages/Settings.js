import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Firebase Firestore instance
import './Settings.css'; // Ensure you have a CSS file for styling

const Settings = () => {
  const [adminUsers, setAdminUsers] = useState([]); // State for admin users
  const [editAdmin, setEditAdmin] = useState(null); // State to hold admin being edited
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '' }); // New admin form state
  const [superAdminCredentials, setSuperAdminCredentials] = useState({ email: '', password: '' }); // Super admin credentials
  const [showSecurityModal, setShowSecurityModal] = useState(false); // Modal for super admin security
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [pendingAdminAction, setPendingAdminAction] = useState(null); // Holds whether it's an "add" or "edit" action

  const adminUsersCollectionRef = collection(db, 'adminusers'); // Reference to 'adminusers' collection

  // Fetch admin users from Firestore on component mount
  useEffect(() => {
    const fetchAdminUsers = async () => {
      setIsLoading(true);
      try {
        const usersSnapshot = await getDocs(adminUsersCollectionRef);
        setAdminUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error('Error fetching admin users:', error);
      }
      setIsLoading(false);
    };
    fetchAdminUsers();
  }, []);

  // Handle opening the security modal
  const handleOpenSecurityModal = (action) => {
    setPendingAdminAction(action); // Set whether it is an "add" or "edit" action
    setShowSecurityModal(true); // Show the security modal
  };

  // Handle closing the security modal
  const handleCloseSecurityModal = () => {
    setSuperAdminCredentials({ email: '', password: '' });
    setShowSecurityModal(false); // Close the security modal
  };

  // Fetch super admin credentials from Firestore and compare them
  const authenticateSuperAdmin = async () => {
    const superAdminDocRef = doc(db, 'superadmin', 'admin1'); // Document reference in Firestore
    try {
      const superAdminDoc = await getDoc(superAdminDocRef); // Get the document from Firestore
      if (superAdminDoc.exists()) {
        const superAdmin = superAdminDoc.data();
        
        // Check if the entered credentials match the Firestore credentials
        if (
          superAdminCredentials.email === superAdmin.email &&
          superAdminCredentials.password === superAdmin.password
        ) {
          if (pendingAdminAction === 'add') {
            handleAddAdmin();
          } else if (pendingAdminAction === 'edit') {
            handleUpdateAdmin();
          }
          handleCloseSecurityModal();
        } else {
          alert('Invalid Super Admin credentials');
        }
      } else {
        console.error('Super Admin document does not exist');
      }
    } catch (error) {
      console.error('Error fetching Super Admin credentials:', error);
    }
  };

  // Handle adding a new admin user
  const handleAddAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) {
      alert('Please fill out all fields');
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(adminUsersCollectionRef, newAdmin);
      setNewAdmin({ email: '', password: '' }); // Reset form

      // Fetch updated admin users after adding a new one
      const usersSnapshot = await getDocs(adminUsersCollectionRef);
      setAdminUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));

      alert('New admin added successfully');
    } catch (error) {
      console.error("Error adding admin user:", error);
    }
    setIsLoading(false);
  };

  // Handle updating an admin's email or password
  const handleUpdateAdmin = async () => {
    if (!editAdmin.email || !editAdmin.password) {
      alert('Please fill out all fields');
      return;
    }

    const adminUserDoc = doc(db, 'adminusers', editAdmin.id);

    setIsLoading(true);
    try {
      await updateDoc(adminUserDoc, {
        email: editAdmin.email,
        password: editAdmin.password,
      });

      // Fetch updated admin users after editing
      const usersSnapshot = await getDocs(adminUsersCollectionRef);
      setAdminUsers(usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));

      setEditAdmin(null); // Exit edit mode
      alert('Admin user updated successfully');
    } catch (error) {
      console.error("Error updating admin user:", error);
    }
    setIsLoading(false);
  };

  // Handle deleting an admin user
  const handleDeleteAdmin = async (id) => {
    const adminUserDoc = doc(db, 'adminusers', id);

    setIsLoading(true);
    try {
      await deleteDoc(adminUserDoc);
      setAdminUsers(adminUsers.filter(user => user.id !== id)); // Remove from UI
      alert('Admin user deleted successfully');
    } catch (error) {
      console.error("Error deleting admin user:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="settings-page">
      <h1>Account Settings</h1>

      {isLoading && <p>Loading...</p>}

  

      {/* User Management */}
      <div className="user-management">
        <h2>User Management</h2>
        <h3>Admin Users</h3>
        <div className="admin-users-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id.substring(0, 4)}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => setEditAdmin(user)}>Edit</button>
                    <button onClick={() => handleDeleteAdmin(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Admin Form */}
        <div className="add-admin-form">
          <h3>Add New Admin</h3>
          <input
            type="email"
            placeholder="Admin Email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          />
          <button onClick={() => handleOpenSecurityModal('add')} className="add-admin-btn">Add Admin</button>
        </div>
      </div>

      {/* Security Modal for Super Admin Verification */}
      {showSecurityModal && (
        <div className="security-modal">
          <div className="modal-content">
            <h2>Super Admin Authentication</h2>
            <p>Please enter Super Admin credentials to proceed.</p>
            <input
              type="email"
              placeholder="Super Admin Email"
              value={superAdminCredentials.email}
              onChange={(e) => setSuperAdminCredentials({ ...superAdminCredentials, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Super Admin Password"
              value={superAdminCredentials.password}
              onChange={(e) => setSuperAdminCredentials({ ...superAdminCredentials, password: e.target.value })}
            />
            <button onClick={authenticateSuperAdmin}>Confirm</button>
            <button onClick={handleCloseSecurityModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {editAdmin && (
        <div className="edit-modal">
          <div className="modal-content">
            <h2>Edit Admin</h2>
            <input
              type="email"
              placeholder="Admin Email"
              value={editAdmin.email}
              onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={editAdmin.password}
              onChange={(e) => setEditAdmin({ ...editAdmin, password: e.target.value })}
            />
            <button onClick={() => handleOpenSecurityModal('edit')}>Update Admin</button>
            <button onClick={() => setEditAdmin(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
