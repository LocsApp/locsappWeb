FROM python:3.4-alpine

ADD . /app
WORKDIR /app
RUN mkdir /app/static
RUN apk update && apk add --no-cache postgresql-dev gcc linux-headers musl-dev
RUN pip install -r /app/requirements.txt

RUN ./manage.py collectstatic --noinput

EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]