// Import Firebase SDK modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBThdfIIitX5gQw0akn9l720dbfu1XYZns",
  authDomain: "nammleproject.firebaseapp.com",
  projectId: "nammleproject",
  storageBucket: "nammleproject.firebasestorage.app",
  messagingSenderId: "514026192645",
  appId: "1:514026192645:web:a11d3f1ed06423bef5416c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Store Implementation
class Store {
  constructor() {
    this.state = { user: null, events: [] };
    this.subscribers = [];
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(callback => callback(this.state));
  }
}

const store = new Store();

// Auth Service
const AuthService = {
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      store.setState({ user: userCredential.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signUp(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      store.setState({ user: userCredential.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signOut() {
    try {
      await signOut(auth);
      store.setState({ user: null });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Event Service
const EventService = {
  async registerEvent(eventData) {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: serverTimestamp(),
        userId: store.state.user.uid
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getEvents() {
    try {
      const snapshot = await getDocs(collection(db, 'events'));
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      store.setState({ events });
      return { success: true, events };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Router
const Router = {
  routes: {
    '/': signInView,
    '/signup': signUpView,
    '/register': registerView,
    '/home': homeView
  },

  init() {
    this.loadRoute();
    window.addEventListener('popstate', () => this.loadRoute());
  },

  navigateTo(path) {
    window.history.pushState({}, '', path);
    this.loadRoute();
  },

  loadRoute() {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes['/'];
  
    document.getElementById('app').innerHTML = route();
    document.body.className = path.slice(1) || 'signin';
  
    // Safely delay execution to ensure elements are in DOM
    requestAnimationFrame(() => {
      switch (path) {
        case '/signup':
          initSignUp();
          break;
        case '/register':
          initEventRegistration();
          break;
        case '/home':
          initHome();  // runs after DOM is ready
          break;
        default:
          initSignIn();
      }
    });
  }
};

// Views
function signInView() {
  return `
    <div class="card">
      <div class="card-header">
        <h1>Welcome Back</h1>
      </div>
      <div class="card-body">
        <form id="signin-form">
          <div class="form-group input-icon">
            <i class="fas fa-envelope"></i>
            <input type="email" id="email" class="form-control" placeholder="Email Address" required>
          </div>
          <div class="form-group input-icon">
            <i class="fas fa-lock"></i>
            <input type="password" id="password" class="form-control" placeholder="Password" required>
          </div>
          <button type="submit" class="btn">Sign In</button>
          <div id="auth-error" class="error-message"></div>
          <div class="auth-link">
            Don't have an account? <a href="/signup" data-link>Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  `;
}

function signUpView() {
  return `
    <div class="card">
      <div class="card-header">
        <h1>Create Account</h1>
      </div>
      <div class="card-body">
        <form id="signup-form">
          <div class="form-group input-icon">
            <i class="fas fa-user"></i>
            <input type="text" id="name" class="form-control" placeholder="Full Name" required>
          </div>
          <div class="form-group input-icon">
            <i class="fas fa-envelope"></i>
            <input type="email" id="email" class="form-control" placeholder="Email Address" required>
          </div>
          <div class="form-group input-icon">
            <i class="fas fa-lock"></i>
            <input type="password" id="password" class="form-control" placeholder="Password" required>
          </div>
          <button type="submit" class="btn">Sign Up</button>
          <div id="auth-error" class="error-message"></div>
          <div class="auth-link">
            Already have an account? <a href="/" data-link>Sign In</a>
          </div>
        </form>
      </div>
    </div>
  `;
}

function registerView() {
  return `
    <div class="card">
      <div class="card-header">
        <h1>Create New Event</h1>
      </div>
      <div class="card-body">
        <form id="event-form">
          <div class="form-group">
            <label for="event-name">Event Name</label>
            <input type="text" id="event-name" class="form-control" placeholder="Enter event name" required>
          </div>
          <div class="form-group">
            <label for="event-date">Date</label>
            <input type="date" id="event-date" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="event-location">Location</label>
            <input type="text" id="event-location" class="form-control" placeholder="Enter event location" required>
          </div>
          <div class="form-group">
            <label for="event-description">Description</label>
            <textarea id="event-description" class="form-control" placeholder="Describe your event..." rows="4"></textarea>
          </div>
          <button type="submit" class="btn">Create Event</button>
          <div id="event-error" class="error-message"></div>
        </form>
      </div>
    </div>
  `;
}

function homeView() {
  return `
    <div class="card">
      <div class="card-header">
        <h1>EventElegance</h1>
      </div>
      <div class="card-body">
        <p style="text-align: center; font-size: 1rem; color: var(--text-dark); margin-bottom: 1rem;">
          Welcome to <strong>EventElegance</strong>, your modern and intuitive platform for creating and managing elegant events effortlessly.
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <button class="btn" id="start-now-btn">Start Now</button>
          <button class="btn" id="view-events-btn" style="background: var(--secondary); color: white;">View My Events</button>
          <button class="btn" id="logout-btn" style="background: var(--dark); color: white;">Logout</button>
        </div>
      </div>
    </div>
  `;
}

// Handlers
function initSignIn() {
  const form = document.getElementById('signin-form');
  const errorElement = document.getElementById('auth-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = await AuthService.signIn(email, password);
    
    if (result.success) {
      Router.navigateTo('/register');
    } else {
      errorElement.textContent = result.error;
    }
  });

  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      Router.navigateTo(link.getAttribute('href'));
    });
  });
}

function initSignUp() {
  const form = document.getElementById('signup-form');
  const errorElement = document.getElementById('auth-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = await AuthService.signUp(email, password, name);
    
    if (result.success) {
      Router.navigateTo('/register');
    } else {
      errorElement.textContent = result.error;
    }
  });

  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      Router.navigateTo(link.getAttribute('href'));
    });
  });
}

function initEventRegistration() {
  const form = document.getElementById('event-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;

    try {
      // Save to Firestore (replace with your Firestore logic)
      await addDoc(collection(db, 'events'), {
        title,
        date,
        createdAt: new Date()
      });

      // ✅ Navigate to home page after successful creation
      Router.navigateTo('/home');

    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  });
}

function initHome() {
  const btn = document.getElementById('start-now-btn');
  if (!btn) {
    console.warn("start-now-btn not found. Retrying...");
    return setTimeout(initHome, 50); // Retry after short delay
  }

  btn.addEventListener('click', () => {
    Router.navigateTo('/register');
  });
}

// Initialize the app
Router.init();