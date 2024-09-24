import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Firestore instance

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollectionRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersData = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            Name: {user.name}, Email: {user.email}, Address: {user.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
