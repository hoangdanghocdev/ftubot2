# Backend Proxy Setup - Complete ✅

## Overview

The backend proxy has been successfully implemented to protect your Gemini API key. The API key is now stored server-side and never exposed to the client.

## Architecture

```
Browser → https://ftu.fyi/api/chat → Nginx → Backend (port 3001) → Gemini API
```

## Components

### 1. Backend Server (`/root/FTU-bot/backend/`)
- **Technology**: Node.js + Express
- **Port**: 3001
- **Process Manager**: PM2
- **API Key**: Stored in `.env` file (server-side only)

### 2. Frontend (`/root/FTU-bot/`)
- **Updated**: Now calls `/api/chat` instead of direct Gemini API
- **API Key**: Removed from frontend build ✅

### 3. Nginx Configuration
- **Proxy**: Routes `/api/*` requests to backend on port 3001
- **SSL**: Handled by nginx (Let's Encrypt)

## API Endpoints

### Health Check
```
GET /api/health
Response: {"status":"ok","service":"ftu-bot-backend"}
```

### Chat (Streaming)
```
POST /api/chat
Body: {
  "prompt": "string",
  "imageParts": [ImagePart] // optional
}
Response: Server-Sent Events stream
```

## Management Commands

### Backend (PM2)

**Start backend:**
```bash
cd /root/FTU-bot/backend
pm2 start ecosystem.config.cjs
```

**Stop backend:**
```bash
pm2 stop ftu-bot-backend
```

**Restart backend:**
```bash
pm2 restart ftu-bot-backend
```

**View logs:**
```bash
pm2 logs ftu-bot-backend
```

**View status:**
```bash
pm2 list
```

**Save PM2 configuration:**
```bash
pm2 save
```

### Update API Key

1. Edit `/root/FTU-bot/backend/.env`:
   ```bash
   nano /root/FTU-bot/backend/.env
   ```

2. Update `GEMINI_API_KEY` value

3. Restart backend:
   ```bash
   pm2 restart ftu-bot-backend
   ```

## Security ✅

- ✅ API key stored server-side only
- ✅ API key removed from frontend JavaScript bundle
- ✅ Backend runs on localhost (not exposed publicly)
- ✅ Nginx handles SSL/TLS
- ✅ CORS configured for your domain only

## Verification

### Check API key is NOT in frontend:
```bash
grep -r "AIzaSy" /var/www/ftu.fyi/assets/*.js
# Should return nothing (or only Firebase key, not Gemini)
```

### Test backend health:
```bash
curl https://ftu.fyi/api/health
# Should return: {"status":"ok","service":"ftu-bot-backend"}
```

### Test backend directly:
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","service":"ftu-bot-backend"}
```

## File Locations

- **Backend code**: `/root/FTU-bot/backend/`
- **Backend logs**: `/root/.pm2/logs/`
- **API key**: `/root/FTU-bot/backend/.env`
- **PM2 config**: `/root/FTU-bot/backend/ecosystem.config.cjs`
- **Nginx config**: `/etc/nginx/sites-available/ftu.fyi`

## Troubleshooting

### Backend not responding

1. Check if backend is running:
   ```bash
   pm2 list
   ```

2. Check backend logs:
   ```bash
   pm2 logs ftu-bot-backend
   ```

3. Restart backend:
   ```bash
   pm2 restart ftu-bot-backend
   ```

### API key errors

1. Check `.env` file exists:
   ```bash
   cat /root/FTU-bot/backend/.env
   ```

2. Verify API key is set in PM2:
   ```bash
   pm2 env 0
   ```

### Nginx proxy not working

1. Test nginx config:
   ```bash
   nginx -t
   ```

2. Check nginx error logs:
   ```bash
   tail -f /var/log/nginx/ftu.fyi.error.log
   ```

3. Reload nginx:
   ```bash
   systemctl reload nginx
   ```

## Deployment

When deploying frontend updates:

```bash
cd /root/FTU-bot
./deploy.sh
```

The backend runs independently and doesn't need redeployment unless you change backend code.

---

**Status**: ✅ Backend proxy is running and protecting your API key!

