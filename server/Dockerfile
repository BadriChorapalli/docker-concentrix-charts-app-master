FROM node

WORKDIR /server

COPY package*.json /server/

RUN npm install


COPY . .

EXPOSE 5000

CMD [ "index.js" ]