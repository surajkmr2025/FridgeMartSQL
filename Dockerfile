FROM node:22-alpine

WORKDIR /app

COPY BACKEND/package*.json ./BACKEND/
COPY FRONTEND/package*.json ./FRONTEND/

RUN cd BACKEND && npm ci --omit=dev
RUN cd FRONTEND && npm ci

COPY BACKEND ./BACKEND
COPY FRONTEND ./FRONTEND

RUN cd FRONTEND && npm run build

ENV NODE_ENV=production
WORKDIR /app/BACKEND

EXPOSE 4000

CMD ["npm", "start"]
