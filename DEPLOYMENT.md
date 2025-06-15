# TestBlok.uz Frontend Deployment Guide

Frontend-only versiya uchun deployment qo'llanmasi

## 🚀 Quick Deploy

### 1. Build qilish
```bash
npm install
npm run build
```

### 2. Deploy opsiyalari

#### A) Netlify (Tavsiya etiladi)
1. [Netlify.com](https://netlify.com)ga kiring
2. "New site from Git" tugmasini bosing
3. GitHub repository'ni tanlang
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Deploy qiling

#### B) Vercel
1. [Vercel.com](https://vercel.com)ga kiring
2. "Import Project" tugmasini bosing
3. GitHub repository'ni tanlang
4. Avtomatik deploy bo'ladi

#### C) GitHub Pages
```bash
npm run build
# dist papkasini gh-pages branch'ga yuklang
```

## 🌐 Custom Domain

### Netlify:
1. Domain settings'ga o'ting
2. Custom domain qo'shing
3. DNS settings'ni yangilang

### Cloudflare (Tavsiya):
1. Domain'ni Cloudflare'ga qo'shing
2. SSL/TLS: Full (strict)
3. Speed optimizations yoqing

## 📊 Performance Optimization

### Build Optimization:
```bash
# Production build
npm run build

# Bundle analyzer
npm install --save-dev webpack-bundle-analyzer
```

### Caching Strategy:
- **HTML:** 1 hour
- **CSS/JS:** 1 year
- **Images:** 1 year

## 🔒 Security Headers

### Netlify (_headers file):
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### Vercel (vercel.json):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## 📱 PWA Setup (Ixtiyoriy)

### 1. Manifest.json:
```json
{
  "name": "TestBlok.uz",
  "short_name": "TestBlok",
  "description": "Professional Test Platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb"
}
```

### 2. Service Worker:
```javascript
// sw.js
self.addEventListener('fetch', event => {
  // Cache strategy
});
```

## 🔧 Environment Variables

### Production (.env.production):
```env
VITE_APP_TITLE=TestBlok.uz
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

## 📈 Analytics Setup

### Google Analytics:
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🚨 Troubleshooting

### 404 Errors:
**Netlify (_redirects file):**
```
/*    /index.html   200
```

**Vercel (vercel.json):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Build Errors:
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run lint
```

## 📊 Monitoring

### Uptime Monitoring:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)

### Performance:
- [PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)

## 💰 Cost Estimation

### Free Tier:
- **Netlify:** 100GB bandwidth/month
- **Vercel:** 100GB bandwidth/month
- **GitHub Pages:** 1GB storage

### Paid Plans:
- **Netlify Pro:** $19/month
- **Vercel Pro:** $20/month

## 🔄 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml):
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📞 Support

Deploy qilishda muammo bo'lsa:
- 📧 adminblock01@ali.com
- 📚 Documentation'ni o'qing
- 🔍 Error logs'ni tekshiring

---

**Ready for production! 🎉**