# 🚀 Deploy Karne Ke Steps

## 1. GitHub Repository Banayein:
1. [github.com](https://github.com) par jao
2. "New repository" click karo
3. Repository name: `car-chat-app`
4. Public select karo
5. "Create repository" click karo

## 2. Code Push Karo:
```bash
cd /Users/amitesh/Desktop/awsapps
git remote add origin https://github.com/YOUR_USERNAME/car-chat-app.git
git branch -M main
git push -u origin main
```

## 3. Render Par Deploy:
1. [render.com](https://render.com) par jao
2. GitHub se sign up karo
3. "New +" → "Web Service" click karo
4. Apna repository select karo
5. Settings:
   - Name: `car-chat-app`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. "Create Web Service" click karo

## 4. Live URL:
Deployment ke baad aapko URL milega: `https://YOUR-APP-NAME.onrender.com`

**Abhi website live nahi hai kyunki deployment nahi hui hai!**