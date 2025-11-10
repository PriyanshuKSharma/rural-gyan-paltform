# Deployment Guide

## Quick Deploy Options

### 1. Vercel (Backend) + Netlify (Frontend) - Recommended

**Backend on Vercel:**
1. Copy `vercel.json` to project root
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

**Frontend on Netlify:**
1. Copy `netlify.toml` to project root
2. Update `REACT_APP_API_URL` with your Vercel backend URL
3. Connect GitHub repo to Netlify
4. Deploy automatically

### 2. Railway (Full-Stack)
1. Copy `railway.json` to project root
2. Connect GitHub repo to Railway
3. Add environment variables
4. Deploy with one click

### 3. Render (Full-Stack)
1. Copy `render.yaml` to project root
2. Connect GitHub repo to Render
3. Configure environment variables
4. Deploy both services

## Environment Variables Required

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
NODE_ENV=production
```

## Demo Credentials
- Admin: admin / admin123
- Teacher: teacher1 / teacher123
- Student: student1 / student123

## Post-Deployment Steps
1. Run seed script to create demo users
2. Test all user roles
3. Verify AI features are working
4. Check real-time features