FROM python:3.12-slim 

WORKDIR /app

# Install dependencies 
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy your database-related scripts and data
COPY seed.py data.py script.sql images/ /app/

# Set the entry point (e.g., seed.py or data.py)
CMD ["python", "seed.py"]
