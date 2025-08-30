// Real-time Chat and WebRTC Implementation
let socket;
let currentUser = null;
let currentRotation = 0;
let localStream = null;
let remoteStream = null;
let peerConnection = null;
let currentCall = null;
let isAudioMuted = false;
let isVideoMuted = false;

// WebRTC Configuration
const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

// AI-Powered Car Database with Image Generation
const carPartsDB = {
    // Indian Cars
    'scorpio': {
        name: 'Mahindra Scorpio',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        aiPrompt: 'Mahindra Scorpio SUV, rugged Indian vehicle, black color, front view',
        details: {
            'Type': 'SUV',
            'Engine': '2.2L Diesel',
            'Power': '120 HP',
            'Price': '₹13-16 Lakh',
            'Fuel Type': 'Diesel'
        }
    },
    'thar': {
        name: 'Mahindra Thar',
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400',
        aiPrompt: 'Mahindra Thar off-road jeep, adventure vehicle, olive green color',
        details: {
            'Type': 'Off-road SUV',
            'Engine': '2.0L Petrol/Diesel',
            'Power': '150 HP',
            'Price': '₹12-15 Lakh',
            'Features': '4WD, Convertible Top'
        }
    },
    'swift': {
        name: 'Maruti Swift',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        aiPrompt: 'Maruti Swift hatchback, compact car, red color, side view',
        details: {
            'Type': 'Hatchback',
            'Engine': '1.2L Petrol',
            'Power': '83 HP',
            'Price': '₹5-8 Lakh',
            'Mileage': '23 kmpl'
        }
    },
    'innova': {
        name: 'Toyota Innova Crysta',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
        aiPrompt: 'Toyota Innova Crysta MPV, family car, white color, front view',
        details: {
            'Type': 'MPV',
            'Engine': '2.4L Diesel',
            'Power': '150 HP',
            'Price': '₹16-24 Lakh',
            'Seating': '7-8 Seats'
        }
    },
    'fortuner': {
        name: 'Toyota Fortuner',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
        aiPrompt: 'Toyota Fortuner SUV, premium vehicle, silver color, 3/4 view',
        details: {
            'Type': 'Premium SUV',
            'Engine': '2.8L Diesel',
            'Power': '204 HP',
            'Price': '₹31-38 Lakh',
            'Features': '4WD, Luxury Interior'
        }
    },
    'creta': {
        name: 'Hyundai Creta',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        aiPrompt: 'Hyundai Creta compact SUV, modern design, blue color',
        details: {
            'Type': 'Compact SUV',
            'Engine': '1.5L Petrol/Diesel',
            'Power': '115 HP',
            'Price': '₹10-17 Lakh',
            'Features': 'Sunroof, Touchscreen'
        }
    },
    // Car Parts
    'engine': {
        name: 'Car Engine',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
        aiPrompt: 'Car engine, V6 motor, detailed mechanical parts, chrome finish',
        details: {
            'Type': 'Internal Combustion',
            'Cylinders': '4-8',
            'Displacement': '1000-3000 CC',
            'Fuel Type': 'Petrol/Diesel/CNG',
            'Technology': 'DOHC, Turbo'
        }
    },
    'seat': {
        name: 'Car Seat',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
        aiPrompt: 'Luxury car seat, leather upholstery, ergonomic design, black color',
        details: {
            'Material': 'Leather/Fabric',
            'Type': 'Bucket/Bench Seat',
            'Adjustment': 'Manual/Electric',
            'Features': 'Heating, Ventilation',
            'Colors': 'Black, Brown, Beige'
        }
    },
    'tire': {
        name: 'Car Tire',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        aiPrompt: 'Car tire, radial design, detailed tread pattern, premium brand',
        details: {
            'Size': '175/65 R14 to 285/45 R20',
            'Type': 'Radial/Tubeless',
            'Brands': 'MRF, Bridgestone, Michelin',
            'Features': 'Run-flat, All-season',
            'Price': '₹3,000-15,000'
        }
    },
    'wheel': {
        name: 'Alloy Wheel',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
        aiPrompt: 'Alloy wheel, sporty design, chrome finish, 5-spoke pattern',
        details: {
            'Size': '14-20 inch',
            'Material': 'Alloy/Steel',
            'Design': '5-spoke, Multi-spoke',
            'Finish': 'Chrome, Matte Black',
            'Price': '₹5,000-25,000'
        }
    },
    'dashboard': {
        name: 'Dashboard',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
        aiPrompt: 'Modern car dashboard, digital display, touchscreen, premium interior',
        details: {
            'Material': 'Soft-touch Plastic',
            'Display': 'Digital/Analog',
            'Features': 'Touchscreen, AC Controls',
            'Technology': 'Android Auto, Apple CarPlay',
            'Design': 'Modern, Ergonomic'
        }
    }
};

// AI-Enhanced Keywords mapping
const keywords = {
    // Indian Car Models
    'scorpio': 'scorpio', 'स्कॉर्पियो': 'scorpio',
    'thar': 'thar', 'थार': 'thar',
    'swift': 'swift', 'स्विफ्ट': 'swift',
    'innova': 'innova', 'इनोवा': 'innova', 'crysta': 'innova',
    'fortuner': 'fortuner', 'फॉर्च्यूनर': 'fortuner',
    'creta': 'creta', 'क्रेटा': 'creta',
    
    // Generic terms
    'car': 'scorpio', 'कार': 'scorpio', 'गाड़ी': 'scorpio',
    'suv': 'scorpio', 'एसयूवी': 'scorpio',
    
    // Car Parts
    'engine': 'engine', 'इंजन': 'engine', 'motor': 'engine', 'मोटर': 'engine',
    'seat': 'seat', 'सीट': 'seat', 'chair': 'seat',
    'tire': 'tire', 'tyre': 'tire', 'टायर': 'tire',
    'wheel': 'wheel', 'व्हील': 'wheel', 'rim': 'wheel', 'रिम': 'wheel',
    'dashboard': 'dashboard', 'डैशबोर्ड': 'dashboard', 'dash': 'dashboard'
};

// AI Response Generator
function generateAIResponse(carModel, userMessage) {
    const responses = {
        'scorpio': [
            'Scorpio एक बेहतरीन SUV है! इसकी rugged looks और powerful engine के लिए famous है।',
            'Mahindra Scorpio की ground clearance 180mm है, off-road के लिए perfect!',
            'Scorpio में 7-seater configuration मिलती है, family के लिए ideal।'
        ],
        'thar': [
            'Thar adventure lovers का favorite! इसकी 4WD capability amazing है।',
            'New Thar में hardtop और softtop दोनों options हैं।',
            'Thar की off-road capability किसी भी terrain को handle कर सकती है!'
        ],
        'swift': [
            'Swift compact और fuel efficient है, city driving के लिए perfect!',
            'Maruti Swift की mileage 23+ kmpl तक मिलती है।',
            'Swift का maintenance cost बहुत कम है, economical choice!'
        ],
        'innova': [
            'Innova Crysta family car का king है! Space और comfort दोनों मिलता है।',
            'Toyota Innova की reliability और resale value excellent है।',
            'Innova में 8-seater option भी available है।'
        ],
        'fortuner': [
            'Fortuner premium SUV segment का leader है!',
            'Toyota Fortuner की build quality और safety features top-notch हैं।',
            'Fortuner का 4WD system किसी भी condition में काम करता है।'
        ],
        'creta': [
            'Creta compact SUV segment में बहुत popular है!',
            'Hyundai Creta के features और technology impressive हैं।',
            'Creta की fuel efficiency और performance का balance perfect है।'
        ]
    };
    
    const modelResponses = responses[carModel] || [
        'यह एक बेहतरीन car model है! क्या आप इसके बारे में और जानना चाहते हैं?'
    ];
    
    return modelResponses[Math.floor(Math.random() * modelResponses.length)];
}

// AI Image Generator (Simulated)
function generateAIImage(prompt) {
    // Simulated AI image generation using Unsplash with specific search terms
    const searchTerms = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ');
    const mainTerm = searchTerms[0] || 'car';
    
    // Generate dynamic image URL based on prompt
    return `https://source.unsplash.com/400x300/?${mainTerm},automotive,vehicle&sig=${Date.now()}`;
}

// Initialize Socket.IO
function initSocket() {
    socket = io();
    
    socket.on('connect', () => {
        console.log('Connected to server');
        addSystemMessage('Connected to server');
        if (currentUser) {
            socket.emit('join-room', currentUser);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
        addSystemMessage('Disconnected from server');
    });
    
    socket.on('user-connected', (data) => {
        console.log('Connected as:', data.username);
        addSystemMessage(`You joined as ${data.username} (${data.userType})`);
    });
    
    socket.on('user-joined', (data) => {
        addSystemMessage(`${data.username} (${data.userType}) joined the chat`);
        updateOnlineCount();
    });
    
    socket.on('user-left', (data) => {
        addSystemMessage(`${data.username} left the chat`);
        updateOnlineCount();
    });
    
    socket.on('receive-message', (message) => {
        addMessage(message.text, message.sender, message.userType, message.timestamp);
        checkForCarParts(message.text);
    });
    
    // WebRTC Signaling
    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-answered', handleCallAnswered);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-ended', handleCallEnded);
}

// Join Chat
function joinChat() {
    const username = document.getElementById('usernameInput').value.trim();
    const userType = document.getElementById('userTypeSelect').value;
    
    if (!username) {
        alert('Please enter your name');
        return;
    }
    
    if (username.length > 20) {
        alert('Name too long (max 20 characters)');
        return;
    }
    
    currentUser = { username, userType };
    document.getElementById('currentUser').textContent = `${username} (${userType})`;
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'flex';
    
    initSocket();
    addSystemMessage('Welcome to Car Chat! Start discussing car parts.');
}

// Send Message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || !socket) return;
    
    socket.emit('send-message', { text: message });
    input.value = '';
}

// Add Message to Chat
function addMessage(message, sender, userType, timestamp) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    const isOwnMessage = sender === currentUser?.username;
    
    messageDiv.className = `message ${isOwnMessage ? 'own' : userType}-message`;
    
    const senderSpan = document.createElement('strong');
    senderSpan.textContent = `${sender} (${userType}):`;
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = ' ' + message;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = new Date(timestamp).toLocaleTimeString();
    
    messageDiv.appendChild(senderSpan);
    messageDiv.appendChild(messageSpan);
    messageDiv.appendChild(timeSpan);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add System Message
function addSystemMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.style.background = '#e3f2fd';
    messageDiv.style.color = '#1976d2';
    messageDiv.style.fontStyle = 'italic';
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update Online Count
let onlineCount = 1;
function updateOnlineCount() {
    onlineCount++;
    document.getElementById('onlineUsers').textContent = `Online: ${onlineCount}`;
}

// AI-Enhanced Car Parts Detection
function checkForCarParts(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [keyword, partKey] of Object.entries(keywords)) {
        if (lowerMessage.includes(keyword)) {
            displayProduct(partKey);
            
            // Generate AI response
            const aiResponse = generateAIResponse(partKey, message);
            setTimeout(() => {
                addMessage(aiResponse, 'AI Assistant', 'ai', new Date().toISOString());
            }, 1000);
            
            break;
        }
    }
}

// AI-Enhanced Product Display with Image Generation
function displayProduct(partKey) {
    const product = carPartsDB[partKey];
    if (!product) return;
    
    const productDisplay = document.getElementById('productDisplay');
    
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // AI Image Generation Section
    const aiSection = document.createElement('div');
    aiSection.className = 'ai-section';
    aiSection.innerHTML = `
        <div class="ai-header">
            <span>🤖 AI Generated Image</span>
            <button onclick="regenerateImage('${partKey}')" class="regenerate-btn">🔄 New Image</button>
        </div>
    `;
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image';
    imageContainer.id = 'productImage';
    
    const img = document.createElement('img');
    // Use AI-generated image if available, fallback to original
    img.src = product.aiPrompt ? generateAIImage(product.aiPrompt) : product.image;
    img.alt = product.name;
    img.style.transform = `rotateY(${currentRotation}deg)`;
    
    // Enhanced error handling with AI fallback
    img.onerror = function() {
        if (this.src.includes('source.unsplash.com')) {
            this.src = product.image; // Fallback to original
        } else {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFJIEltYWdlIEdlbmVyYXRpb248L3RleHQ+PC9zdmc+';
        }
    };
    
    imageContainer.appendChild(img);
    
    const controls = document.createElement('div');
    controls.className = 'rotation-controls';
    
    const leftBtn = document.createElement('button');
    leftBtn.textContent = '← Left';
    leftBtn.onclick = () => rotateImage(-30);
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.onclick = () => resetRotation();
    
    const rightBtn = document.createElement('button');
    rightBtn.textContent = 'Right →';
    rightBtn.onclick = () => rotateImage(30);
    
    controls.appendChild(leftBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(rightBtn);
    
    const details = document.createElement('div');
    details.className = 'product-details';
    
    const title = document.createElement('h3');
    title.textContent = product.name;
    details.appendChild(title);
    
    // AI Prompt Display
    if (product.aiPrompt) {
        const aiPromptDiv = document.createElement('div');
        aiPromptDiv.className = 'ai-prompt';
        aiPromptDiv.innerHTML = `<small>🎨 AI Prompt: ${product.aiPrompt}</small>`;
        details.appendChild(aiPromptDiv);
    }
    
    Object.entries(product.details).forEach(([key, value]) => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        
        const label = document.createElement('span');
        label.className = 'detail-label';
        label.textContent = key + ':';
        
        const valueSpan = document.createElement('span');
        valueSpan.className = 'detail-value';
        valueSpan.textContent = value;
        
        detailItem.appendChild(label);
        detailItem.appendChild(valueSpan);
        details.appendChild(detailItem);
    });
    
    productCard.appendChild(aiSection);
    productCard.appendChild(imageContainer);
    productCard.appendChild(controls);
    productCard.appendChild(details);
    
    productDisplay.innerHTML = '';
    productDisplay.appendChild(productCard);
    
    addDragRotation();
}

// Regenerate AI Image Function
function regenerateImage(partKey) {
    const product = carPartsDB[partKey];
    if (!product || !product.aiPrompt) return;
    
    const img = document.querySelector('#productImage img');
    if (img) {
        // Add loading effect
        img.style.opacity = '0.5';
        
        // Generate new image with timestamp for uniqueness
        const newImageUrl = generateAIImage(product.aiPrompt + ' ' + Date.now());
        
        img.onload = () => {
            img.style.opacity = '1';
        };
        
        img.src = newImageUrl;
        
        // Show AI response
        setTimeout(() => {
            addMessage('🤖 New AI image generated! How does this look?', 'AI Assistant', 'ai', new Date().toISOString());
        }, 500);
    }
}

// Image Rotation Functions
function rotateImage(degrees) {
    currentRotation += degrees;
    const img = document.querySelector('#productImage img');
    if (img) {
        img.style.transform = `rotateY(${currentRotation}deg)`;
    }
}

function resetRotation() {
    currentRotation = 0;
    const img = document.querySelector('#productImage img');
    if (img) {
        img.style.transform = 'rotateY(0deg)';
    }
}

let dragListeners = null;

function addDragRotation() {
    const productImage = document.getElementById('productImage');
    if (!productImage) return;
    
    if (dragListeners) {
        document.removeEventListener('mousemove', dragListeners.mousemove);
        document.removeEventListener('mouseup', dragListeners.mouseup);
    }
    
    let isDragging = false;
    let startX = 0;
    
    const mousedownHandler = (e) => {
        isDragging = true;
        startX = e.clientX;
        productImage.style.cursor = 'grabbing';
    };
    
    const mousemoveHandler = (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const rotationDelta = deltaX * 0.5;
        currentRotation += rotationDelta;
        
        const img = document.querySelector('#productImage img');
        if (img) {
            img.style.transform = `rotateY(${currentRotation}deg)`;
        }
        
        startX = e.clientX;
    };
    
    const mouseupHandler = () => {
        isDragging = false;
        const productImage = document.getElementById('productImage');
        if (productImage) {
            productImage.style.cursor = 'grab';
        }
    };
    
    productImage.addEventListener('mousedown', mousedownHandler);
    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('mouseup', mouseupHandler);
    
    dragListeners = {
        mousemove: mousemoveHandler,
        mouseup: mouseupHandler
    };
}

// WebRTC Call Functions
async function startCall(callType) {
    try {
        const constraints = {
            audio: true,
            video: callType === 'video'
        };
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        peerConnection = new RTCPeerConnection(rtcConfig);
        
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        
        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            document.getElementById('remoteVideo').srcObject = remoteStream;
        };
        
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && currentCall) {
                socket.emit('ice-candidate', {
                    to: currentCall,
                    candidate: event.candidate
                });
            }
        };
        
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // For demo, we'll call the first available user
        // In production, you'd have a user selection UI
        currentCall = 'demo-user';
        
        socket.emit('call-user', {
            to: currentCall,
            offer: offer,
            callType: callType
        });
        
        showCallModal(callType);
        document.getElementById('localVideo').srcObject = localStream;
        
    } catch (error) {
        console.error('Error starting call:', error);
        alert('Could not access camera/microphone');
    }
}

function showCallModal(callType) {
    document.getElementById('callModal').style.display = 'flex';
    document.getElementById('callStatus').textContent = `${callType} Call - Connecting...`;
    
    if (callType === 'audio') {
        document.getElementById('localVideo').style.display = 'none';
        document.getElementById('remoteVideo').style.display = 'none';
    }
}

async function handleIncomingCall(data) {
    currentCall = data.from;
    
    document.getElementById('callerName').textContent = `${data.caller} is calling...`;
    document.getElementById('incomingCallModal').style.display = 'flex';
    
    // Store the offer for when user accepts
    window.incomingOffer = data.offer;
    window.incomingCallType = data.callType;
}

async function acceptCall() {
    try {
        document.getElementById('incomingCallModal').style.display = 'none';
        
        const constraints = {
            audio: true,
            video: window.incomingCallType === 'video'
        };
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        peerConnection = new RTCPeerConnection(rtcConfig);
        
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        
        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            document.getElementById('remoteVideo').srcObject = remoteStream;
        };
        
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && currentCall) {
                socket.emit('ice-candidate', {
                    to: currentCall,
                    candidate: event.candidate
                });
            }
        };
        
        await peerConnection.setRemoteDescription(window.incomingOffer);
        
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket.emit('answer-call', {
            to: currentCall,
            answer: answer
        });
        
        showCallModal(window.incomingCallType);
        document.getElementById('localVideo').srcObject = localStream;
        
    } catch (error) {
        console.error('Error accepting call:', error);
    }
}

function rejectCall() {
    document.getElementById('incomingCallModal').style.display = 'none';
    socket.emit('end-call', { to: currentCall });
    currentCall = null;
}

async function handleCallAnswered(data) {
    try {
        await peerConnection.setRemoteDescription(data.answer);
        document.getElementById('callStatus').textContent = 'Connected';
    } catch (error) {
        console.error('Error handling call answer:', error);
    }
}

async function handleIceCandidate(data) {
    try {
        if (peerConnection) {
            await peerConnection.addIceCandidate(data.candidate);
        }
    } catch (error) {
        console.error('Error handling ICE candidate:', error);
    }
}

function handleCallEnded() {
    endCall();
}

function endCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    if (currentCall) {
        socket.emit('end-call', { to: currentCall });
        currentCall = null;
    }
    
    document.getElementById('callModal').style.display = 'none';
    document.getElementById('incomingCallModal').style.display = 'none';
}

function toggleMute() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            isAudioMuted = !audioTrack.enabled;
            document.getElementById('muteBtn').textContent = isAudioMuted ? '🔇' : '🎤';
        }
    }
}

function toggleVideo() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            isVideoMuted = !videoTrack.enabled;
            document.getElementById('videoToggleBtn').textContent = isVideoMuted ? '📹' : '📷';
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    document.getElementById('loginModal').style.display = 'flex';
});