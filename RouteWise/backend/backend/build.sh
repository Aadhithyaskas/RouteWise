#!/bin/bash
set -e

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Building React (Vite) ==="
cd frontend
npm install
npm run build
cd ..

echo "=== Copying Vite dist to Django ==="
mkdir -p templates
mkdir -p static

cp frontend/dist/index.html templates/index.html
cp -r frontend/dist/assets/. static/

echo "=== Django collectstatic ==="
python manage.py collectstatic --noinput

echo "=== Django migrate ==="
python manage.py migrate

echo "=== Build complete! ==="
