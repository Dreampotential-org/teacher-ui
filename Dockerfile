FROM ubuntu:latest

RUN apt-get update && apt-get install
RUN cd www && npm install
