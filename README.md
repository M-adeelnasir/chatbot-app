# Enhanced Chat Interface

This project is a React-based chat interface that connects to backend APIs for chat communication and health monitoring. The interface provides a sleek, responsive design and a user-friendly experience for interacting with an assistant bot.

---

## Features
- **Chat with Assistant**: Sends user messages to the API and displays assistant responses in real-time.
- **Server Health Check**: Monitors the health status of the backend server with a dynamic button indicator.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.
- **Sidebar Management**: Easily toggle a collapsible sidebar for better navigation.

---

## Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn

---

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   REACT_APP_API_URL=http://127.0.0.1:8000/api/chat
   REACT_APP_HEALTH_URL=http://127.0.0.1:8000/api/health
   ```

   For Vite users:
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api/chat
   VITE_HEALTH_URL=http://127.0.0.1:8000/api/health
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

5. Open the app in your browser at `http://localhost:3000`.

---

## Usage
### Chat API
The chat interface connects to the `API_URL` to send user messages and retrieve assistant responses.

**Endpoint**: `POST /api/chat`

**Request Body**:
```json
{
  "user_message": "Your message here"
}
```

---

### Health Check API
The health status of the server is monitored by pinging the `HEALTH_URL`.

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "success"  // or "failure"
}
```

---

## Project Structure
- **`src`**: Contains all React components and logic.
  - `App.jsx`: Main application logic, including API integration.
  - `components`: Reusable UI components like the sidebar and chat interface.
- **`.env`**: Stores API URLs for local and production environments.

---

## Customization
You can update the API URLs by modifying the `.env` file:
```env
REACT_APP_API_URL=https://your-production-url/api/chat
REACT_APP_HEALTH_URL=https://your-production-url/api/health
```

For Vite users:
```env
VITE_API_URL=https://your-production-url/api/chat
VITE_HEALTH_URL=https://your-production-url/api/health
```

---

## Deployment
To build and deploy the application:
1. Build the production-ready app:
   ```bash
   npm run build
   ```
   or
   ```bash
   yarn build
   ```

2. Deploy the `build` folder to your preferred hosting platform (e.g., Netlify, Vercel, AWS S3).

---

## How to Start the Application
To start the development server:
1. Navigate to the project folder.
2. Run the following command:
   ```bash
   npm start
   ```

This will start the application, and you can view it in your browser at `http://localhost:3000`.

---

## Acknowledgments
- [React](https://reactjs.org/)
- [Lucide Icons](https://lucide.dev/)

If you encounter any issues or have suggestions, feel free to open an issue or submit a pull request.
```
