FROM eu.gcr.io/tippiq-platform/node-base-6-9-1:node-6-9-1-b3

ENV NODE_ENV=production

VOLUME /root/.yarn-cache

WORKDIR /opt/app

COPY . /opt/app

RUN \
  yarn install && \
  yarn run build
# todo: 'yarn install -- production' failes, removed for now

EXPOSE 3010

CMD [ "yarn", "start" ]

