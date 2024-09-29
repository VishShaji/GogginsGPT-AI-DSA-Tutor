# Build stage - Use a lightweight image for building dependencies
FROM python:3.10-slim AS builder

# Set environment variables to avoid bytecode and ensure proper buffer handling
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Install dependencies separately for caching
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage - Use a clean, minimal base for production
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Copy installed dependencies from builder stage
COPY --from=builder /root/.local /root/.local

# Update PATH to use pip-installed dependencies
ENV PATH=/root/.local/bin:$PATH

# Copy the application code to the working directory
COPY . .

# Expose the port Uvicorn will run on
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
