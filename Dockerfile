FROM node:18.19-alpine as install
## Install Nest CLI globally
RUN yarn global add @nestjs/cli
## Work directory
WORKDIR /home/node/app
## Copy
COPY nest-cli.json package.json yarn.lock tsconfig.json tsconfig.build.json ./
## Install dependencies
RUN yarn install --frozen-lockfile

FROM install as production
## Work directory
WORKDIR /home/node/app
## Env
ENV HUSKY=0
## Remove development dependencies
RUN yarn install --production --frozen-lockfile
## Remove unused dependencies
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/

FROM install as build
## Work directory
WORKDIR /home/node/app
# ## Copy
COPY apps/api ./apps/api
COPY libs ./libs
COPY nest-cli.json package.json yarn.lock tsconfig.json tsconfig.build.json ./
## Build source
RUN yarn build api

FROM node:18.19-alpine as runtime
## Work directory
WORKDIR /home/node/app
COPY --from=build --chown=node:node /home/node/app/dist ./dist
COPY --from=production --chown=node:node /home/node/app/node_modules ./node_modules

EXPOSE 8000

CMD ["node", "dist/apps/api/src/main"]
