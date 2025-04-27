# Use an official Python runtime as a base image
FROM python:3.10

# Set working directory inside container
WORKDIR /app

# Copy requirements.txt first, install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source code
COPY . .

# Expose the port Flask will run on (default 5000)
EXPOSE 5000

# Start the Flask app
CMD ["python", "run.py"]
