FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run generate:menu
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
