from flask import Flask, request, jsonify, send_from_directory, abort
import re

app = Flask(__name__)

# Configurações de segurança
app.config["MAX_CONTENT_LENGTH"] = 1024  # Limita payload a 1KB
app.config["JSON_SORT_KEYS"] = False


def validar_nota(nota, nome_campo):
    """Validação paranoica de notas"""
    try:
        # Converte para float
        nota_float = float(nota)

        # Verifica se é um número válido (não NaN, não Infinity)
        if not (nota_float == nota_float and abs(nota_float) != float("inf")):
            raise ValueError(f"{nome_campo} inválida: não é um número válido")

        # Verifica range [0, 10]
        if nota_float < 0 or nota_float > 10:
            raise ValueError(f"{nome_campo} fora do range permitido (0-10)")

        # Arredonda para 2 casas decimais para evitar problemas de precisão
        return round(nota_float, 2)

    except (ValueError, TypeError) as e:
        raise ValueError(f"Erro ao validar {nome_campo}: {str(e)}")


def sanitizar_input(data, campos_esperados):
    """Remove campos não esperados e valida estrutura"""
    if not isinstance(data, dict):
        raise ValueError("Dados devem ser um objeto JSON")

    # Remove campos não esperados
    dados_limpos = {k: v for k, v in data.items() if k in campos_esperados}

    # Verifica se todos os campos esperados estão presentes
    if set(dados_limpos.keys()) != set(campos_esperados):
        raise ValueError(f"Campos esperados: {', '.join(campos_esperados)}")

    return dados_limpos


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


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/ap3.html")
def ap3_page():
    return send_from_directory(".", "ap3.html")


@app.route("/calculate", methods=["POST"])
def calculate():
    try:
        # Verifica Content-Type
        if not request.is_json:
            abort(400, description="Content-Type deve ser application/json")

        data = request.get_json()

        # Sanitiza e valida estrutura
        campos_esperados = ["ad1", "ap1", "ad2"]
        dados_limpos = sanitizar_input(data, campos_esperados)

        # Valida cada nota individualmente
        ad1 = validar_nota(dados_limpos["ad1"], "AD1")
        ap1 = validar_nota(dados_limpos["ap1"], "AP1")
        ad2 = validar_nota(dados_limpos["ad2"], "AD2")

        # Calcula nota
        nota_ap2 = calcular_nota_ap2(ad1, ap1, ad2)

        return jsonify({"nota_ap2": round(nota_ap2, 2), "success": True})

    except ValueError as e:
        return jsonify({"error": str(e), "success": False}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor", "success": False}), 500


@app.route("/calculate-ap3", methods=["POST"])
def calculate_ap3():
    try:
        # Verifica Content-Type
        if not request.is_json:
            abort(400, description="Content-Type deve ser application/json")

        data = request.get_json()

        # Sanitiza e valida estrutura
        campos_esperados = ["ad1", "ap1", "ad2", "ap2"]
        dados_limpos = sanitizar_input(data, campos_esperados)

        # Valida cada nota individualmente
        ad1 = validar_nota(dados_limpos["ad1"], "AD1")
        ap1 = validar_nota(dados_limpos["ap1"], "AP1")
        ad2 = validar_nota(dados_limpos["ad2"], "AD2")
        ap2 = validar_nota(dados_limpos["ap2"], "AP2")

        # Calcula nota AP3
        resultado = calcular_nota_ap3(ad1, ap1, ad2, ap2)
        resultado["success"] = True

        return jsonify(resultado)

    except ValueError as e:
        return jsonify({"error": str(e), "success": False}), 400
    except Exception as e:
        return jsonify({"error": "Erro interno do servidor", "success": False}), 500


# Headers de segurança
@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
