from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import DATABASE_URI

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

@app.errorhandler(400)
def custom400(error):
    return jsonify({"message": error.description or "Bad Request"}), 400


@app.errorhandler(422)
def custom422(error):
    return (
        jsonify({"errors": error.data.get("messages", ["Invalid request arguments"])}),
        422,
    )

CORS(app)
db = SQLAlchemy(app)
