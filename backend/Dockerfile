FROM python:3.9-bookworm

WORKDIR /user/src/app

COPY 'requirements.txt' .

# Instala las dependencias con pipenv
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT ["python", "app.py"]
