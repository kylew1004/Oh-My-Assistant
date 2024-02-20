FROM node:latest
WORKDIR /demo/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]