FROM python:3.12

# prevents django from writing pyc files in the container.
ENV PYTHONDONTWRITEBYTECODE=1
# sends logs in the container console without buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]
