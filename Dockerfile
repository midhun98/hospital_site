FROM python:3.12

# Prevent Django from writing pyc files in the container.
ENV PYTHONDONTWRITEBYTECODE=1
# Sends logs in the container console without buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]
