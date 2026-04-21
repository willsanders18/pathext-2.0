FROM ubuntu:18.04
ENV DEBIAN_FRONTEND=noninteractive

# System deps
RUN apt-get update && apt-get install -y \
    build-essential libssl-dev zlib1g-dev libncurses5-dev \
    libreadline-dev libsqlite3-dev libgdbm-dev libbz2-dev \
    libexpat1-dev liblzma-dev libffi-dev uuid-dev \
    wget dos2unix \
    && rm -rf /var/lib/apt/lists/*

# Build Python 3.6.9 from source for PathExt
RUN cd /tmp && \
    wget https://www.python.org/ftp/python/3.6.9/Python-3.6.9.tgz && \
    tar -xf Python-3.6.9.tgz && cd Python-3.6.9 && \
    ./configure && \
    make -j1 && make altinstall && \
    rm -rf /tmp/Python-3.6.9*

# Build Python 3.10.13 from source for FastAPI
RUN cd /tmp && \
    wget https://www.python.org/ftp/python/3.10.13/Python-3.10.13.tgz && \
    tar -xf Python-3.10.13.tgz && cd Python-3.10.13 && \
    ./configure && \
    make -j1 && make altinstall && \
    rm -rf /tmp/Python-3.10.13*

# Copy PathExt and set up its Python 3.6.9 venv
WORKDIR /pathext
COPY legacy/ .
RUN dos2unix *.sh && chmod +x *.sh
RUN python3.6 -m venv venv && \
    venv/bin/pip install --upgrade pip && \
    venv/bin/pip install pandas==0.25.3 networkx==1.11 numpy==1.17.4

# Set up FastAPI with Python 3.10
WORKDIR /app
COPY backend/requirements.txt .
RUN python3.10 -m venv venv && \
    venv/bin/pip install --upgrade pip && \
    venv/bin/pip install -r requirements.txt
COPY backend/ .

EXPOSE 8000
CMD ["venv/bin/gunicorn", "-w", "2", \
    "-k", "uvicorn.workers.UvicornWorker", \
    "--timeout", "600", "--bind", "0.0.0.0:8000", "main:app"]