FROM node:12.13-alpine AS development

# WORKDIR /usr/src/app
ADD package*.json ./
ADD yarn.* ./
#RUN yarn --only=development
RUN yarn

ADD . .

FROM node:12.13-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/appß

ADD package*.json ./
ADD yarn.* ./

#RUN yarn --production
RUN yarn

ADD  . ./dist

RUN yarn build

RUN ls -l

CMD ["node", "dist/main"]

#CMD ["pm2-runtime", "dist/main"]

