# Pull official base image 
FROM python:3.10-slim

# Set working directory
WORKDIR /courses

# Set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y gcc python3-dev musl-dev libmagic1 libffi-dev netcat-traditional \
    build-essential libpq-dev 

COPY poetry.lock pyproject.toml /courses

RUN pip3 install poetry
RUN poetry config virtualenvs.create false

RUN pip install gunicorn==20.1.0
# Install dependencies
RUN poetry install
# Copy entrypoint.sh
COPY ./docker/dev/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

COPY . /courses/

ENTRYPOINT [ "/entrypoint.sh" ]