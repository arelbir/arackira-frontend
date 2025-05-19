# ---- Frontend Dockerfile ----
FROM node:20-alpine

WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --omit=dev

# Uygulama dosyalarını kopyala
COPY . .

# Next.js build
RUN npm run build

# 3000 portunu aç
EXPOSE 3000

# Ortam değişkeni örneği (geliştiriciye not)
# ENV NEXT_PUBLIC_API_BASE=http://localhost:4000

# Uygulamayı başlat
CMD ["npm", "start"]
