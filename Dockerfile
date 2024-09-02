FROM node:20-alpine

EXPOSE 5173

WORKDIR /app
COPY . .

RUN npm install --omit=dev
RUN npm run build

CMD ["npm", "run", "docker-start"]
