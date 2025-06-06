FROM node:18-slim

# Install necessary dependencies
RUN apt update && apt install -y \
  chromium \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libasound2 \
  libatk1.0-0 \
  libgtk-3-0 \
  libnss3 \
  libxss1 \
  libxtst6 \
  --no-install-recommends && \
  apt clean && rm -rf /var/lib/apt/lists/*

# Create app dir
WORKDIR /app
COPY . .

RUN npm install

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 3000
CMD ["node", "index.js"]
