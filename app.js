// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      store.setState({ user: userCredential.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signUp(email, password, name) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: name });
      store.setState({ user: userCredential.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signOut() {
    try {
      await auth.signOut();
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
      const docRef = await db.collection('events').add({
        ...eventData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: store.state.user.uid
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getEvents() {
    try {
      const snapshot = await db.collection('events').get();
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
    '/register': registerView
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
    
    if (path === '/signup') initSignUp();
    else if (path === '/register') initEventRegistration();
    else initSignIn();
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
  const errorElement = document.getElementById('event-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const eventData = {
      name: document.getElementById('event-name').value,
      date: document.getElementById('event-date').value,
      location: document.getElementById('event-location').value,
      description: document.getElementById('event-description').value
    };

    const result = await EventService.registerEvent(eventData);
    
    if (result.success) {
      alert('Event created successfully!');
      form.reset();
    } else {
      errorElement.textContent = result.error;
    }
  });
}

// Initialize the app
Router.init();