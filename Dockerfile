FROM node:14
WORKDIR /app

RUN curl -fsSL https://deno.land/install.sh | sh
ENV DENO_INSTALL /root/.deno
ENV PATH $DENO_INSTALL/bin:$PATH

RUN deno install -n dmps --allow-env --allow-net https://raw.githubusercontent.com/isanasan/dmps/main/mod.ts
