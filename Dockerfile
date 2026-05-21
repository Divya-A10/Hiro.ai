# Use a slim production-grade base Python environment
FROM python:3.11-slim

# Prevent Python from writing pyc files and buffer outputs for real-time Cloud Logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies needed for compiling certain Postgres packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code layout
COPY . .

# Expose target internal port for Cloud Run routing
EXPOSE 8080

# Launch application via high-performance production server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
