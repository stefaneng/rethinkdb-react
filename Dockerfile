FROM node:4.2-onbuild

RUN npm run build

ENV RETHINKDB_HOST rethinkdb