from flask import Flask

from apis.user import user_api
from apis.record import record_api

app = Flask(__name__)

app.register_blueprint(user_api, url_prefix="/api")
app.register_blueprint(record_api, url_prefix="/api")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
