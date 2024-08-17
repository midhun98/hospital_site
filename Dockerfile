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
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "hospital_site.wsgi:application"]

