# Car Chat App - Production Ready

एक production-ready web application जहाँ users और sellers के बीच real-time chat, audio calls, और video calls हो सकती हैं। जब भी कोई car part की बात करते हैं, तो उसकी image और details side में दिखाई देती है।

## 🚀 Features

- **Real-time Chat**: Socket.IO के साथ instant messaging
- **Audio/Video Calls**: WebRTC के साथ high-quality calls
- **Smart Detection**: Car parts के keywords को automatically detect करता है
- **360° Image View**: Images को drag करके या buttons से rotate करें
- **User Management**: Buyer/Seller roles के साथ
- **Production Ready**: Security, error handling, और performance optimized

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 🎯 How to Use

1. **Start Server**: `npm start` (Port 3000)
2. **Open Browser**: `http://localhost:3000`
3. **Join Chat**: Enter name और select role (Buyer/Seller)
4. **Chat**: Type messages about car parts
5. **Make Calls**: Click audio 📞 या video 📹 buttons

## 📱 Call Features

- **Audio Calls**: High-quality voice communication
- **Video Calls**: HD video with local/remote streams
- **Call Controls**: Mute/unmute, video on/off
- **Incoming Calls**: Accept/reject incoming calls
- **Call Management**: End calls, connection status

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **WebRTC**: Peer-to-peer audio/video
- **Security**: Input sanitization, XSS protection

## 🚗 Supported Car Parts

- **Scorpio/स्कॉर्पियो**: Complete car details
- **Engine/इंजन**: Engine specifications  
- **Seat/सीट**: Seat details और materials
- **Tire/टायर**: Tire size और specifications
- **Wheel/व्हील**: Wheel details
- **Dashboard/डैशबोर्ड**: Dashboard features

## 🔒 Security Features

- Input sanitization (XSS protection)
- Safe DOM manipulation
- Error handling for media access
- Memory leak prevention
- Secure WebRTC connections

## 📊 Performance Optimizations

- Efficient keyword matching
- DOM query optimization
- Event listener cleanup
- Image error handling
- Responsive design

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 📝 Environment Variables

```bash
PORT=3000  # Server port (optional)
```

## 🚀 Deployment

### Heroku
```bash
git add .
git commit -m "Deploy car chat app"
git push heroku main
```

### AWS/Digital Ocean
```bash
npm install --production
pm2 start server.js
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - feel free to use for commercial projects.

---

**Made with ❤️ for car enthusiasts**