import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000')  // ✅ Fixed URL
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error('Error fetching message:', error)); // ✅ Added error handling
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React Frontend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
