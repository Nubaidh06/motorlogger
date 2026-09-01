# MotorLogger 🚗🔧

> A responsive Progressive Web Application (PWA) for logging and tracking vehicle service history, maintenance records, and Revenue Licence expiry dates.

**Live Application:** [https://motorlogger-912f4.web.app](https://motorlogger-912f4.web.app)

---

## Features

- **User Authentication**: Secure email and password registration and login powered by Firebase Authentication.
- **Vehicles CRUD**:
  - Add vehicles with make, model, year, registration number plate, mileage, and optional photo.
  - View full vehicle details, mileage, total maintenance expenditure, and Revenue Licence status.
  - Edit vehicle details and delete vehicles with automatic cascade deletion of all associated service logs.
- **Service Logs CRUD**:
  - Record maintenance logs for specific vehicles (oil changes, repairs, inspections, tyre changes, etc.).
  - Track service date, workshop/garage location, odometer reading at service, and cost in Sri Lankan Rupees (Rs. / LKR).
  - Edit and delete individual service logs.
- **Interactive Dashboard**:
  - Overview cards showing total tracked vehicles, total money spent across all logs, and date of most recent service.
  - Recent activity feed showing the latest service records.
  - Quick action buttons to add vehicles or jump to vehicle history.
- **Two Data Sources**:
  1. **NHTSA Vehicle API**: Live external REST API dynamically populating 190+ car manufacturer suggestions in a native HTML `<datalist>`.
  2. **Static JSON Dataset (`serviceTypes.json`)**: Local dataset containing predefined service categories.
- **Progressive Web App (PWA)**:
  - Installable directly to desktop or mobile home screen via custom in-app install prompt.
  - Offline asset caching with Workbox and Web App Manifest.
- **UI & Accessibility**:
  - Dark and Light mode toggle with automatic detection of user system preferences.
  - Fully responsive design tailored for mobile (<640px), tablet (640px–1024px), and desktop (1024px+) screens.
  - Native browser push notifications confirming add, update, and delete actions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS |
| **Routing** | React Router v6 |
| **Authentication** | Firebase Authentication |
| **Database** | Firebase Cloud Firestore (NoSQL) |
| **Image Hosting** | Cloudinary (Unsigned upload preset) |
| **PWA & Caching** | `vite-plugin-pwa` + Workbox |
| **External API** | NHTSA Vehicle API |
| **Hosting** | Firebase Hosting |

---

## Project Structure

```text
motorlogger/
├── public/
│   ├── icons/            # PWA app icons (192x192, 512x512)
│   └── favicon.ico
├── src/
│   ├── assets/           # Static images and icons
│   ├── components/
│   │   ├── layout/       # Navbar, Footer, Layout wrapper
│   │   ├── logs/         # ServiceLogCard, ServiceLogForm
│   │   ├── ui/           # ConfirmModal, EmptyState, LoadingSpinner
│   │   ├── vehicles/     # VehicleCard, VehicleForm
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Global auth state & hooks
│   ├── data/
│   │   └── serviceTypes.json # Local static dataset
│   ├── firebase/
│   │   ├── config.js     # Firebase initialization & exports
│   │   ├── vehicles.js   # Firestore vehicles collection helper functions
│   │   ├── serviceLogs.js# Firestore serviceLogs helper functions
│   │   └── cloudinary.js # Image upload handler
│   ├── hooks/
│   │   └── useNotification.js # Browser notification hook
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── VehiclesPage.jsx
│   │   ├── VehicleDetailPage.jsx
│   │   ├── AddEditVehiclePage.jsx
│   │   └── AddEditLogPage.jsx
│   ├── App.jsx           # Route definitions & theme provider
│   ├── index.css         # Global styles & Tailwind directives
│   └── main.jsx          # React DOM entry point
├── firebase.json         # Firebase Hosting SPA configuration
├── package.json
├── tailwind.config.js
└── vite.config.js        # Vite & PWA manifest configuration
```

---

## Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Nubaidh06/motorlogger.git
cd motorlogger
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory and provide your Firebase and Cloudinary credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

### 4. Run the development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Building for Production & Deployment

To create an optimized production bundle:
```bash
npm run build
```

To deploy the production build to Firebase Hosting:
```bash
firebase deploy --only hosting
```

---

## Academic Context

- **Module**: COMP50075 Web Development (Resit)
- **Year**: 2026
