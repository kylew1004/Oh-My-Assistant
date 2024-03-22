# pull official base image
FROM python:3.8.3-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /backend
COPY requirements.txt /backend/

RUN apk update
RUN apk add build-base
RUN apk add libressl-dev libffi-dev gcc musl-dev gcc python3-dev musl-dev zlib-dev mariadb-dev mariadb-client jpeg-dev #--(5.2)

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /backend/