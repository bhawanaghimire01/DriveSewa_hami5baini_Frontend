# 🚗 DriveSewa: Vehicle Diagnostics, Parts Inventory & Operations System

DriveSewa is a premium, full-stack vehicle service and retail operations ecosystem. It bridges the gap between vehicle owners, garage operations staff, and store administrators. The system features a modern, clean Web API backend coupled with an interactive, rich web frontend featuring custom portals for **Customers**, **Staff**, and **Administrators**.

---

## 👥 Development Team
DriveSewa was conceptualized, designed, and engineered by:
* **Bhawana**
* **Shelika**
* **Jessica**
* **Sakila**
* **Purnima**

---

## 🛠️ Technology Stack & Frameworks

### 1. Backend Engine
* **Framework:** ASP.NET Core 10.0 (Web API)
* **Database Access:** Entity Framework Core (EF Core) with Code-First Migrations
* **Database:** PostgreSQL
* **Security:** JWT (JSON Web Tokens) Bearer Authentication with Role-Based Access Controls
* **AI Integration:** Google Gemini API (with robust offline/fallback dynamic diagnostics)
* **Background Tasks:** Hosted background service for automated invoice email alerts
* **Communication:** SMTP Mail Kit for automated email notifications

### 2. Frontend Portal
* **Structure:** HTML5 Semantic Markup
* **Styling & Design:** Vanilla CSS3
  * Google Fonts integration (*Outfit* typography)
  * Harmonized vibrant gradients & modern UI cards
  * Glassmorphism effects, fluid layout systems, and custom hover states
* **Logic:** Vanilla ES6 JavaScript (Fetch API integration, token session handling, dynamic DOM mapping)
* **No Heavy Frameworks:** Purely client-side reactive rendering to guarantee performance and microsecond load times.

---

## 📂 Project Architecture

```text
DriveSewa/
│
├── DriveSewa_Backend/                   # C# ASP.NET Core Web API Project
│   ├── Controllers/                     # REST API Endpoints (Admin, Staff, Customer)
│   ├── Data/                            # Database Context (ApplicationDbContext)
│   ├── DTOs/                            # Data Transfer Objects for clean API contracts
│   ├── Migrations/                      # Entity Framework Core database version history
│   ├── Models/                          # Database Entities (Vehicle, Customer, Invoice, Part)
│   ├── Services/                        # Business Logic (GeminiAiService, EmailService)
│   └── appsettings.json                 # API Server Configurations
│
├── DriveSewa_hami5baini_Frontend/       # Vanilla Web Frontend Client
│   ├── assets/                          # Shared media, logos, and custom global JS files
│   ├── components/                      # Reusable components
│   ├── pages/
│   │   ├── Admin/                       # Admin Portal (Inventory, Staff, Vendors, Finances)
│   │   ├── Staff/                       # Staff Portal (Invoices, Customers, AI, Appointments)
│   │   └── Customer/                    # Customer Portal (History, Appointments, Vehicles)
│   ├── public/                          # Common pages (Login, Registration, Public assets)
│   └── index.html                       # Entry Point Redirector
│
└── README.md                            # Global System Overview
```

---

## 🌟 Core Portals & Features

### 1. 🛡️ Administrator Portal
* **Inventory Control:** Monitor, restock, and create purchase invoices from registered vendors.
* **Staff Management:** Create and authorize garage operation team accounts.
* **Financial Analytics:** Live sales tracking, dynamic revenue reporting, and dues overview.
* **Real-time Notifications:** Automated indicators for low part stocks and pending approvals.

### 2. ⚡ Garage Staff Operations Portal
* **AI Predictive Diagnostics:** Interactive Gemini AI engine that analyzes vehicle odometer, age, and symptoms (e.g., brakes, transmission, suspension issues) to build a multi-page maintenance forecast.
* **Sales Invoicing:** Instant checkout for parts. Calculates tax, custom discounts, and decrements parts inventory instantly.
* **Appointments & Requests:** Oversee customer booking requests and handle part request tickets.
* **Customer Lookup:** Query customer accounts by name, registered license plate, or phone number.

### 3. 👤 Customer Hub
* **Active Garage:** Register and view multiple owned vehicles.
* **Service Dashboard:** Schedule service appointments and request specialty vehicle parts.
* **Digital History:** Review all past parts invoices, service details, and tracking statuses.

---

## ⚡ Installation & Getting Started

### Prerequisites
* **.NET 10.0 SDK** or higher
* **PostgreSQL Database Server**
* **Google Gemini API Key** (Optional)

---

### Step 1: Clone the Repositories
The system is divided into two separate, secure repositories:

1. **Clone the Backend Repository:**
   ```bash
   git clone https://github.com/bhawanaghimire01/DriveSewa_hami5baini_Backend.git DriveSewa
   ```
2. **Clone the Frontend Repository (Inside the root folder):**
   ```bash
   cd DriveSewa
   git clone https://github.com/bhawanaghimire01/DriveSewa_hami5baini_Frontend.git DriveSewa_hami5baini_Frontend
   ```

---

### Step 2: Configure & Launch Backend
1. Open the backend configuration:
   [appsettings.json](file:///c:/Users/ASUS/ad/DriveSewa/DriveSewa_Backend/appsettings.json)
2. Update the PostgreSQL connection string and SMTP/Gemini keys:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Database=drivesewa;Username=postgres;Password=YOUR_PASSWORD"
   },
   "Gemini": {
     "ApiKey": "YOUR_GEMINI_API_KEY"
   }
   ```
3. Run the migrations to establish your database tables:
   ```bash
   dotnet ef database update
   ```
4. Start the ASP.NET Core server:
   ```bash
   dotnet run
   ```
   *The backend will boot on `http://localhost:5178/`.*

---

### Step 3: Run the Frontend
1. The frontend client runs completely in the browser.
2. Simply double-click the main [index.html](file:///c:/Users/ASUS/ad/DriveSewa/DriveSewa_hami5baini_Frontend/index.html) or run a simple local web server:
   ```bash
   cd DriveSewa_hami5baini_Frontend
   npx live-server
   ```
3. Register a test Customer, or log in using administrative accounts to explore the full dashboard functionality!
