FROM node:20.10.0

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn global add @nestjs/cli

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "start:dev" ]