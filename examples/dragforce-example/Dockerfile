FROM python:latest

# Sets working directory
WORKDIR /usr/src/app

# Copy requirements.txt file into container
COPY requirements.txt .

# install required libraries
RUN pip install --no-cache-dir -r requirements.txt

# Copy problem script into container
COPY problem.py .

# Run commands
CMD [ "python", "problem.py" ]