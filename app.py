import math

from flask import Flask, jsonify, request, send_from_directory
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

# Configurações de segurança
app.config["MAX_CONTENT_LENGTH"] = 1024  # Limita payload a 1KB
app.json.sort_keys = False

# Páginas servidas pelo site. Só estes arquivos saem da raiz do projeto.
PAGINAS = {
    "/": "index.html",
    "/ap3.html": "ap3.html",
    "/biblioteconomia.html": "biblioteconomia.html",
    "/biblioteconomia-ap3.html": "biblioteconomia-ap3.html",
}

# Tudo vem do próprio site; nada de script ou estilo inline nem de terceiros.
CONTENT_SECURITY_POLICY = "; ".join(
    [
        "default-src 'none'",
        "script-src 'self'",
        "style-src 'self'",
        "font-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "base-uri 'none'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ]
)

SECURITY_HEADERS = {
    "Content-Security-Policy": CONTENT_SECURITY_POLICY,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
}


def validar_nota(nota, nome_campo):
    """Validação paranoica de notas: só números de verdade entre 0 e 10"""
    # bool é subclasse de int em Python, então precisa ser barrado antes
    if isinstance(nota, bool) or not isinstance(nota, (int, float)):
        raise ValueError(f"{nome_campo} deve ser um número")

    nota_float = float(nota)

    if not math.isfinite(nota_float):
        raise ValueError(f"{nome_campo} inválida: não é um número válido")

    if nota_float < 0 or nota_float > 10:
        raise ValueError(f"{nome_campo} fora do range permitido (0-10)")

    # Arredonda para 2 casas decimais para evitar problemas de precisão
    return round(nota_float, 2)


def ler_notas(campos_esperados):
    """Lê o JSON da requisição e exige exatamente os campos esperados"""
    if not request.is_json:
        raise ValueError("Content-Type deve ser application/json")

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        raise ValueError("Dados devem ser um objeto JSON")

    if set(data.keys()) != set(campos_esperados):
        raise ValueError(f"Campos esperados: {', '.join(campos_esperados)}")

    return {campo: validar_nota(data[campo], campo.upper()) for campo in campos_esperados}


def calcular_nota_ap2(ad1, ap1, ad2):
    """Cálculo de N1 usando as notas da AD1 e AP1"""
    N1 = (ad1 * 2 + ap1 * 8) / 10

    # Calculando a nota necessária em N2 para que a média N seja no mínimo 6
    N2_necessario = 12 - N1

    # Calculando a nota necessária na AP2 com base no N2 necessário e na nota da AD2
    ap2_necessario = (N2_necessario * 10 - ad2 * 2) / 8

    return ap2_necessario


def calcular_nota_ap3(ad1, ap1, ad2, ap2):
    """Cálculo de N1 e N2"""
    N1 = (ad1 * 2 + ap1 * 8) / 10
    N2 = (ad2 * 2 + ap2 * 8) / 10

    # Média atual
    N = (N1 + N2) / 2

    # Se já passou, não precisa de AP3
    if N >= 6:
        return {"ap3_necessario": 0, "ja_passou": True, "media_atual": round(N, 2)}

    # Para passar com AP3: NF = [MAIOR(N1, N2) + AP3] / 2 >= 5
    # Logo: MAIOR(N1, N2) + AP3 >= 10
    # AP3 >= 10 - MAIOR(N1, N2)
    maior_nota = max(N1, N2)
    ap3_necessario = 10 - maior_nota

    return {
        "ap3_necessario": round(ap3_necessario, 2),
        "ja_passou": False,
        "media_atual": round(N, 2),
        "maior_nota": round(maior_nota, 2),
    }


def servir_pagina():
    return send_from_directory(".", PAGINAS[request.path])


for caminho in PAGINAS:
    app.add_url_rule(caminho, endpoint=f"pagina:{caminho}", view_func=servir_pagina)


@app.route("/calculate", methods=["POST"])
def calculate():
    try:
        notas = ler_notas(["ad1", "ap1", "ad2"])
        nota_ap2 = calcular_nota_ap2(**notas)
        return jsonify({"nota_ap2": round(nota_ap2, 2), "success": True})
    except ValueError as e:
        return jsonify({"error": str(e), "success": False}), 400


@app.route("/calculate-ap3", methods=["POST"])
def calculate_ap3():
    try:
        notas = ler_notas(["ad1", "ap1", "ad2", "ap2"])
        resultado = calcular_nota_ap3(**notas)
        resultado["success"] = True
        return jsonify(resultado)
    except ValueError as e:
        return jsonify({"error": str(e), "success": False}), 400


# Erros HTTP (404, 405, 413...) sem página padrão nem detalhes internos
@app.errorhandler(HTTPException)
def erro_http(e):
    return jsonify({"error": e.name, "success": False}), e.code


@app.errorhandler(Exception)
def erro_interno(e):
    app.logger.exception("Erro não tratado")
    return jsonify({"error": "Erro interno do servidor", "success": False}), 500


# Headers de segurança
@app.after_request
def add_security_headers(response):
    response.headers.update(SECURITY_HEADERS)
    # Não revela a versão do servidor
    response.headers["Server"] = "cederj-vacation"
    # Respostas da API nunca devem ficar em cache
    if request.path.startswith("/calculate"):
        response.headers["Cache-Control"] = "no-store"
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
