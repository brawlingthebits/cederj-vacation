# Usar a imagem base do Python
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de requisitos e instalar as dependências
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Copiar só o que o site precisa (o resto fica de fora pelo .dockerignore)
COPY app.py gunicorn.conf.py ./
COPY *.html ./
COPY static ./static

# Rodar sem privilégios de root
RUN useradd --create-home --uid 10001 app
USER app

EXPOSE 8080

# Servidor de produção (o servidor do Flask é só para desenvolvimento)
CMD ["gunicorn", "--config", "gunicorn.conf.py", "app:app"]
