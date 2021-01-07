FROM node:alpine

RUN mkdir /app
WORKDIR /app
COPY src src
COPY .env .env
COPY .gitignore .gitignore
COPY nodemon.json nodemon.json
COPY ormconfig.json ormconfig.json
COPY tsconfig.json tsconfig.json
COPY README.md README.md
COPY package.json package.json
RUN npm i

CMD npm start

