# FastAPI-React Stock Screener

A full-stack stock screener application built using FastAPI and React that allows users to analyze and filter stocks based on predefined criteria.

## 🎯 Overview

This project is a modern stock screening tool that combines the power of a robust Python backend with an intuitive React frontend. Users can efficiently analyze and filter stocks based on various financial metrics and criteria, making informed investment decisions easier.

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs with Python
- **Python** - Server-side logic and data processing

### Frontend
- **React** - UI library for building interactive user interfaces
- **JavaScript** - Client-side logic and interactivity
- **HTML/CSS** - Markup and styling

### Architecture
```
fastapi-react-stock-screener/
├── backend/          # FastAPI application
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── frontend/         # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

## ✨ Features

- **Stock Filtering** - Filter stocks based on predefined financial criteria
- **Real-time Analysis** - Analyze stock data with up-to-date information
- **Interactive Dashboard** - User-friendly interface for stock screening
- **RESTful API** - Well-documented API endpoints for stock data operations
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 14+ and npm (for frontend)
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📚 API Documentation

Once the FastAPI backend is running, interactive API documentation is available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔧 Configuration

### Backend Configuration
- Update `.env` file in the backend directory with your configuration
- Configure database connections, API keys, and other settings as needed

### Frontend Configuration
- Update environment variables in `frontend/.env`
- Configure API base URL and other client-side settings

## 📖 Usage

1. Start both the backend and frontend servers following the setup instructions
2. Open your browser and navigate to `http://localhost:3000`
3. Use the dashboard to:
   - View available stocks
   - Apply filters based on financial criteria
   - Analyze stock performance
   - Export or save screening results

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🔒 Security Considerations

- Never commit sensitive information like API keys or database credentials
- Use environment variables for all sensitive configuration
- Implement proper authentication and authorization on API endpoints
- Validate and sanitize all user inputs

## 📦 Deployment

### Backend Deployment
- Deploy FastAPI app using services like Heroku, AWS, or DigitalOcean
- Use a production ASGI server like Gunicorn with Uvicorn workers
- Set appropriate environment variables for production

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy to services like Vercel, Netlify, or GitHub Pages
- Configure API endpoint to point to production backend

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/VanshKhurana-hub/fastapi-react-stock-screener).

## 📌 Project Status

This project is actively maintained and open to contributions.

---

**Built with ❤️ by [VanshKhurana-hub](https://github.com/VanshKhurana-hub)**
