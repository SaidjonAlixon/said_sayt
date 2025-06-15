# TestBlok.uz - Frontend Only Version

Professional onlayn test platformasi - faqat frontend versiyasi

## 🚀 Xususiyatlar

- ⚛️ **React 18 + TypeScript** - Zamonaviy frontend texnologiyalar
- 🎨 **Tailwind CSS** - Professional dizayn
- 📱 **Responsive Design** - Barcha qurilmalarda ishlaydi
- 💾 **LocalStorage** - Ma'lumotlar brauzerda saqlanadi
- 🔐 **Authentication** - Login/Register tizimi
- 📊 **Dashboard** - Student va Admin panellari
- 📝 **Test System** - To'liq test tizimi
- 💳 **Payment Simulation** - To'lov tizimi simulyatsiyasi
- 📈 **Analytics** - Statistika va tahlil
- 🏆 **Ranking** - Foydalanuvchilar reytingi

## 🛠️ O'rnatish va ishga tushirish

### 1. Loyihani yuklab oling
```bash
git clone https://github.com/YOUR_USERNAME/testblok-uz-frontend.git
cd testblok-uz-frontend
```

### 2. Dependencies o'rnating
```bash
npm install
```

### 3. Development serverini ishga tushiring
```bash
npm run dev
```

### 4. Brauzerda oching
```
http://localhost:5173
```

## 📦 Production uchun build qilish

```bash
npm run build
```

Build qilingan fayllar `dist` papkasida bo'ladi.

## 🔑 Default Login Ma'lumotlari

### Admin:
- **Email:** adminblock01@ali.com
- **Parol:** 12345BlokTest!

### Yangi foydalanuvchi:
- Ro'yxatdan o'ting va birinchi testni bepul ishlang!

## 📁 Loyiha Tuzilishi

```
src/
├── components/          # React komponentlar
│   ├── Admin/          # Admin panel komponentlari
│   ├── Auth/           # Authentication komponentlari
│   ├── Dashboard/      # Dashboard komponentlari
│   ├── Test/           # Test tizimi komponentlari
│   └── ...
├── contexts/           # React Context'lar
├── data/              # Default ma'lumotlar
├── utils/             # Utility funksiyalar
├── types/             # TypeScript type'lar
└── ...
```

## 💾 Ma'lumotlar Saqlash

Barcha ma'lumotlar brauzerning **localStorage**'ida saqlanadi:

- **Foydalanuvchilar va parollar**
- **Test natijalari**
- **To'lov ma'lumotlari**
- **Xabarlar va bildirishnomalar**
- **Yordam so'rovlari**

## 🎯 Asosiy Funksiyalar

### Student Dashboard:
- ✅ Mavjud testlarni ko'rish
- ✅ Test ishlash
- ✅ Natijalarni ko'rish
- ✅ Reyting va tahlil
- ✅ Profil boshqaruvi
- ✅ To'lov qilish (simulyatsiya)

### Admin Panel:
- ✅ Foydalanuvchilarni boshqarish
- ✅ Yo'nalishlar va fanlar
- ✅ Savollar qo'shish/tahrirlash
- ✅ To'lovlarni tasdiqlash
- ✅ Yordam so'rovlari
- ✅ Xabarlar yuborish

## 🌐 Deployment

### Netlify:
1. GitHub'ga push qiling
2. Netlify'da yangi site yarating
3. GitHub repository'ni ulang
4. Deploy qiling

### Vercel:
1. GitHub'ga push qiling
2. Vercel'da import qiling
3. Deploy qiling

### GitHub Pages:
```bash
npm run build
# dist papkasini GitHub Pages'ga yuklang
```

## 🔧 Konfiguratsiya

### Environment Variables (.env):
```env
VITE_APP_TITLE=TestBlok.uz
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

## 📱 Responsive Design

- 📱 **Mobile** - 320px+
- 📱 **Tablet** - 768px+
- 💻 **Desktop** - 1024px+
- 🖥️ **Large** - 1280px+

## 🎨 Dizayn Tizimi

- **Primary Colors:** Blue (600) to Emerald (600)
- **Typography:** System fonts
- **Spacing:** 8px grid system
- **Components:** Tailwind CSS

## 🔒 Xavfsizlik

- ✅ Input validation
- ✅ XSS protection
- ✅ Secure localStorage usage
- ✅ Client-side authentication

## 📊 Performance

- ⚡ **Fast loading** - Optimized build
- 📦 **Small bundle** - Code splitting
- 🚀 **Modern browsers** - ES2020+

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating
3. Commit qiling
4. Push qiling
5. Pull Request oching

## 📄 License

MIT License - [LICENSE](LICENSE) faylini ko'ring

## 📞 Support

- 📧 **Email:** adminblock01@ali.com
- 🌐 **Website:** https://testblok.uz
- 📱 **Telegram:** @testblok_support

---

**TestBlok.uz** - Abituriyentlar uchun professional test platformasi! 🎓