version: '3.8'

services:
  app:
    image: ewire-app-image
    container_name: ewire-container
    ports:
      - "8001:8000"
    volumes:
      - .:/app
    env_file:
      - .env