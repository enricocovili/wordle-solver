FROM python:3.10-alpine
WORKDIR /code
COPY . /code/
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "80"]
