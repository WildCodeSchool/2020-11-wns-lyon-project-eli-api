FROM node:alpine

RUN mkdir /app
WORKDIR /app
COPY .env .env
COPY .gitignore .gitignore
COPY nodemon.json nodemon.json
COPY ormconfig.json ormconfig.json
COPY tsconfig.json tsconfig.json
COPY README.md README.md
COPY package.json package.json
RUN npm i
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
COPY src src


CMD npm start

