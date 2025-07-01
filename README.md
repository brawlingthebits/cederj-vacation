
# quero-ferias-cederj

Este projeto é uma aplicação Flask simples que calcula a nota necessária na prova AP2 para que a média final do aluno seja no mínimo 6, com base nas notas de AD1, AP1 e AD2.

## Requisitos

- Python 3.x
- Flask

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/quero-ferias-cederj.git
   ```
   
2. Navegue até o diretório do projeto:
   ```bash
   cd quero-ferias-cederj
   ```

3. Crie um ambiente virtual (opcional, mas recomendado):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

4. Instale as dependências:
   ```bash
   pip install flask
   ```
---

## Executando com `python app.py`

Este método funciona diretamente se o seu script `app.py` contém a verificação `if __name__ == '__main__':` e chama `app.run(...)`. Para usar este método:

1. Certifique-se de que as dependências estão instaladas (especialmente o Flask).
2. No terminal, na raiz do projeto, execute:
   ```bash
   python app.py
   ```
3. Acesse `http://localhost:8080` no navegador para ver a aplicação em funcionamento.

---

## Executando com `flask run`

Essa abordagem usa as variáveis de ambiente para configurar e iniciar a aplicação. Siga os passos abaixo:

1. **Defina a variável de ambiente para o aplicativo Flask**:

   - **No Linux/Mac**:
     ```bash
     export FLASK_APP=app.py
     export FLASK_ENV=development  # Opcional: ativa o modo de desenvolvimento com recarregamento automático.
     ```
   - **No Windows (cmd.exe)**:
     ```cmd
     set FLASK_APP=app.py
     set FLASK_ENV=development
     ```
     **No Windows (PowerShell)**:
     ```powershell
     $env:FLASK_APP = "app.py"
     $env:FLASK_ENV = "development"
     ```

2. **Instale o Flask**, se ainda não o fez:
   ```bash
   pip install flask
   ```

3. **Execute o comando**:
   ```bash
   flask run --host=0.0.0.0 --port=8080
   ```
   - Os parâmetros `--host=0.0.0.0` e `--port=8080` são utilizados para replicar a configuração de `app.run(host='0.0.0.0', port=8080)` do script. Se você não especificá-los, o Flask usará os padrões (`127.0.0.1` e porta `5000`).

4. **Abra o navegador** e acesse:
   ```
   http://localhost:8080
   ```
   ou, se estiver usando `127.0.0.1` e a porta 5000:
   ```
   http://127.0.0.1:5000
   ```

---
