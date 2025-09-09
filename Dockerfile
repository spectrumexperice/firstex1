# استخدم نسخة Node 20 الخفيفة
FROM node:20-alpine

# مجلد العمل داخل الحاوية
WORKDIR /app

# انسخ ملفات package.json و package-lock.json
COPY package*.json ./

# ثبّت الحزم متجاوزاً مشاكل peer-deps
RUN npm install --legacy-peer-deps

# انسخ باقي ملفات المشروع
COPY . .

# ابني المشروع
RUN npm run build

# افتح المنفذ 3000
EXPOSE 3000

# أمر التشغيل
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]

