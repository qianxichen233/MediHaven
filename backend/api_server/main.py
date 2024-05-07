from flask import Flask
from flask_cors import CORS

from apis.user import user_api
from apis.record import record_api
from apis.schedule import schedule_api
from apis.medicines import medicine_api

config = {
    "ORIGINS": [
        "http://localhost:1212",
        "http://127.0.0.1:1212",
        "http://localhost:1213",
        "http://127.0.0.1:1213",
    ],
}

# config = {
#     "ORIGINS": "*",
# }

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": config["ORIGINS"]}}, supports_credentials=True)

app.register_blueprint(user_api, url_prefix="/api")
app.register_blueprint(record_api, url_prefix="/api")
app.register_blueprint(schedule_api, url_prefix="/api")
app.register_blueprint(medicine_api, url_prefix="/api")

if __name__ == "__main__":
    app.run(port=5000, debug=True)
