FROM node:12.8

WORKDIR /usr/src/app
COPY package.json .
COPY src/ ./

RUN npm i
EXPOSE 8080
CMD ["node", "index"]