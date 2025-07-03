// Firebase config (no imports needed, using CDN compat)
// const firebaseConfig = {
//     apiKey: "AIzaSyBVBqVV1YiTmu2yCfW68jxmr3cnXx-vqX0",
//     authDomain: "trackit--dts.firebaseapp.com",
//     projectId: "trackit--dts",
//     storageBucket: "trackit--dts.firebasestorage.app",
//     messagingSenderId: "49347098537",
//     appId: "1:49347098537:web:47ec15ea7be0536278b6b8",
//     measurementId: "G-KPBJ3TSWT3"
// };

// firebase.initializeApp(firebaseConfig);
// const analytics = firebase.analytics();
// const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (loginForm && usernameInput && passwordInput) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }
            try {
                // Call backend API for login
                const response = await fetch('https://trackit-backend-xu6a.onrender.com/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();
                if (!response.ok) {
                    alert(result.message || 'Invalid username or password.');
                    return;
                }
                // Store user info for dashboard
                localStorage.setItem('loggedInUser', JSON.stringify(result));
                // Redirect based on role
                if (result.role === 'admin') {
                    window.location.href = 'admin_dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                alert('Login error: ' + error.message);
            }
        });
    }
});

// Import the Firebase modules (if using modules, otherwise use CDN in HTML)
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

// Initialize Firebase
// const db1 = firebase.firestore();

// Example: Get all users from 'users' collection
function getAllUsers() {
    // db.collection('users').get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         console.log(doc.id, doc.data());
    //     });
    // }).catch((error) => {
    //     console.error('Error getting users:', error);
    // });
}

// Example: Add a new user
// db.collection('users').add({
//     username: 'newuser',
//     is_active: 1
// }).then((docRef) => {
//     console.log('User added with ID:', docRef.id);
// }).catch((error) => {
//     console.error('Error adding user:', error);
// });

// Call getAllUimage.pngest
getAllUsers(); 