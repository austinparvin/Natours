FROM node:18
ENV PORT=3000

WORKDIR app

COPY package.json .
RUN npm install

COPY . .
EXPOSE $PORT 
CMD npm run start