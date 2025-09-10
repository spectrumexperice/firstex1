# استخدم نسخة Node 20 الخفيفة
FROM node:20-alpine

# مجلد العمل داخل الحاوية
WORKDIR /app

# انسخ ملفات package.json و package-lock.json فقط أولاً لتفعيل الـ caching
COPY package*.json ./

# ثبّت الحزم مع تجاهل مشاكل peer-deps
RUN npm install --legacy-peer-deps

# انسخ باقي ملفات المشروع
COPY . .

# بناء المشروع (Production build)
RUN npm run build

# تعيين متغير البيئة لـ Node production
ENV NODE_ENV=production

# فتح المنفذ الديناميكي (Render يعطيه عبر $PORT)
EXPOSE 10000

# CMD مرن عشان Render
CMD ["sh", "-c", "npm start -- -H 0.0.0.0 -p ${PORT:-3000}"]
