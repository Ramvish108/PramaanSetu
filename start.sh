#!/bin/bash
set -e

echo "🚀 Starting PramaanSetu API..."
echo "📁 Current directory: $(pwd)"
echo "📁 Files: $(ls -la)"
echo "🐍 Python version: $(python --version)"

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🚀 Starting server..."
exec uvicorn server:app --host 0.0.0.0 --port $PORT