# Use Python 3.12 as the base image
FROM python:3.12

# Set working directory in the container
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire server source code into the container
COPY . .

# Set environment variables for Flask
ENV FLASK_APP=run.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development

# Expose Flask's default port
EXPOSE 5000

# Run the Flask application
CMD ["flask", "run"]
