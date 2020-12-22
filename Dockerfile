FROM node:12.13-alpine AS development

WORKDIR /usr/src/app
#COPY package.json ./
#COPY yarn.* ./

COPY . .

RUN npm i --development

#COPY . .

FROM node:12.13-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . .
#COPY package*.json ./
#COPY yarn.* ./

RUN ls -l

RUN npm i --production
#RUN yarn

RUN npm run build

#COPY --from=development . ./dist
COPY . ./dist

RUN ls -l

CMD ["node", "dist/main"]

#CMD ["pm2-runtime", "dist/main"]

