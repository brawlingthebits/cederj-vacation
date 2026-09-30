# Configuração do gunicorn para produção
import gunicorn

bind = "0.0.0.0:8080"
workers = 2
threads = 2
timeout = 30

# Limites de requisição: o site só recebe JSON pequeno
limit_request_line = 2048
limit_request_fields = 50
limit_request_field_size = 4096

# Não revela a versão do servidor no cabeçalho Server
gunicorn.SERVER = "cederj-vacation"

accesslog = "-"
errorlog = "-"
