# 🚌 TicketKati - Bangladesh Bus Ticket System

A modern, fully responsive bus ticket booking frontend built with React.

## Features

- 🔐 User Authentication (Register/Login with show/hide password)
- 🔍 Bus Search (from → to destination, date, time)
- 🗺️ Real-time Bus Tracking (UI simulation)
- 💳 Bangladeshi Payment Gateway (bKash, Nagad, Rocket, SSLCommerz)
- 📄 PDF Ticket Download after payment
- 📱 Fully Responsive (Mobile, Tablet, Desktop)
- 8 Bangladesh buses with real routes

## Buses Available

1. Drutogami Express
2. Rajib Paribahan
3. Hanif Enterprise
4. Dhaka-Tangail Bhuyapuri
5. Sirajganj Travel
6. Lalmonirhat Express
7. Comilla Travel
8. Cox's Bazar Sleeper Coach

## Getting Started

### Prerequisites
- Node.js >= 16
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourname/ticketkati-frontend.git

# Navigate to project
cd TicketKati_Frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env

# Start development server
npm start
```

App runs at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Auth/          # Login, Register components
│   ├── Bus/           # BusSearch, BusList, BusTracker
│   ├── Payment/       # Payment gateway UI
│   ├── Ticket/        # Ticket download & display
│   ├── Layout/        # Navbar, Footer
│   └── Common/        # Shared UI components
├── pages/             # Route-level pages
├── context/           # React Context (Auth, Booking)
├── hooks/             # Custom hooks
├── utils/             # Helpers (pdf, date, format)
└── assets/styles/     # Global CSS
```

## Tech Stack

- **Frontend**: React 18, React Router v6
- **Styling**: CSS Variables, custom design system
- **Animation**: Framer Motion
- **PDF**: jsPDF + jspdf-autotable
- **Icons**: React Icons
- **HTTP**: Axios (ready for backend)
- **Toast**: React Hot Toast

## Backend Integration

Backend API base URL is configured in `.env`:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## License

MIT © TicketKati 2024
