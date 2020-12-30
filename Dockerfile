FROM node:12.13-alpine AS development

WORKDIR /usr/src/app

COPY . .

RUN npm i --development

FROM node:12.13-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . .

RUN ls -l

RUN npm i --production
RUN npm install pm2 -g

RUN npm run build

COPY . ./dist

RUN ls -l
RUN pwd

CMD ["pm2-runtime", "dist/main.js", "-i", "max", "--only", "nest-docker-pm2"]œ

