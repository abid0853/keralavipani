# 🌴 KeralaVipani

**KeralaVipani** is a real-time market rate dashboard for Kerala. It is designed to track and verify daily commodity prices—including vegetables, fruits, fish, meat, and fuel—across all 14 districts. 

Built with modern web technologies, it features an interactive smart shopping list, a gamified contributor leaderboard, and a secure admin verification system to ensure data accuracy.

![KeralaVipani](public/logo.png) ---

## ✨ Key Features

* **📈 Live Market Rates:** Real-time price tracking for multiple commodities across all 14 districts of Kerala.
* **🛒 Smart Shopping List:** A dynamic grocery list that calculates an estimated budget based on state averages. Includes one-click PDF export and direct WhatsApp sharing.
* **🤝 Community Submissions:** Authenticated users can report new prices or suggest edits to existing rates to keep the market data fresh.
* **🏆 Gamified Leaderboard:** Contributors earn "Trust Points" for verified submissions, climbing the All-Time and Monthly Champion leaderboards.
* **🛡️ Admin Control Panel:** A secure, role-based dashboard to approve/reject community submissions, manage active market data, and oversee the user directory.
* **📱 Progressive Web App (PWA) Ready:** Fully responsive, mobile-first design that functions seamlessly on any device.
* **🔍 SEO Optimized:** Dynamic meta tags and JSON-LD schema markup implemented for maximum search engine visibility.

---

## 🛠️ Tech Stack

**Frontend Framework:** React.js (via Vite)  
**Styling:** Tailwind CSS  
**Backend & Database:** Firebase (Firestore, Authentication)  
**Routing:** React Router DOM  
**SEO Management:** React Helmet Async  
**Hosting & Deployment:** Vercel  

---

## 🌍 Open Source & Contributing

**KeralaVipani is an open-source project!** We welcome developers, designers, and market enthusiasts to contribute to the platform. Whether it's adding new features, squashing bugs, or improving the UI, your help is greatly appreciated.

**How to contribute:**
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes comments where necessary.

---

## 🚀 Local Setup (For Review Purposes)

If you are reviewing this code and want to run it locally:

1. **Clone the repository**
   ```sh
   git clone [https://github.com/your-username/KeralaVipani.git](https://github.com/your-username/KeralaVipani.git)
Navigate to the project directory

Bash
cd KeralaVipani
Install dependencies

Bash
npm install
Set up Environment Variables
Create a .env file in the root directory with your Firebase configuration:

Code snippet
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Start the development server  

Bash
npm run dev
👨‍💻 Developed By
  
Built and maintained as a personal project by Abid T.S.  

Live Demo: keralavipani.abidts.work
