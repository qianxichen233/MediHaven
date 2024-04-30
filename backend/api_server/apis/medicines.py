from flask import Flask, Blueprint, jsonify
from flask_restful import Api, Resource, reqparse
from datetime import datetime, timedelta

from grpc_client.grpc_api import GRPC_API

medicine_api = Blueprint("medicine_api", __name__)
api = Api(medicine_api)


class medicine(Resource):
    def __init__(self):
        self.get_parser = reqparse.RequestParser()
        self.get_parser.add_argument(
            "type", type=str, help="medicine type", required=True, location="args"
        )

    def get(self):
        args = self.get_parser.parse_args()

        response = GRPC_API.getMedicines(args)

        result = []
        for medicine in response.medicines:
            result.append(
                {
                    "name": medicine.name,
                    "instruction": medicine.instruction,
                    "description": medicine.description,
                    "type": medicine.type,
                }
            )

        return jsonify({"medicines": result})


api.add_resource(medicine, "/medicines")
