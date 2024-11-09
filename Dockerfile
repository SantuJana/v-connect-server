FROM node:18
WORKDIR /app
COPY packeg*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD [ "npm", "start" ]