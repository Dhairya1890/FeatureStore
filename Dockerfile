FROM python:3.12-slim

WORKDIR /app

# Install system deps for psycopg2-binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all Python modules
COPY features.py .
COPY init_db.py .
COPY seed.py .
COPY registry/ registry/
COPY online/ online/
COPY offline/ offline/
COPY sdk/ sdk/
COPY materialization/ materialization/
COPY monitoring/ monitoring/
COPY .env .
