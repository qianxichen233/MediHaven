from flask import Flask, Blueprint, jsonify
from flask_restful import Api, Resource, reqparse
from datetime import datetime, timedelta

import inspect

from grpc_client.grpc_api import GRPC_API

user_api = Blueprint("record_api", __name__)
api = Api(user_api)

class record(Resource):
    def __init__(self):
        self.get_parser = reqparse.RequestParser()
        self.get_parser.add_argument("SSN", type=str, help="SSN", required=True)
        self.get_parser.add_argument("issuer_email", type=str, help="Issuer Email", required=True)
        self.get_parser.add_argument("timestamp", type=str, help="Timestamp", required=True)
        self.get_parser.add_argument(
            "X-Signature", type=str, help="signature", required=True, location="headers"
        )
    
    def get_args(self):
        caller = inspect.stack()[1].function
        args = getattr(self, caller + "_parser").parse_args()
        if hasattr(args, "X-Signature"):
            args.signature = args["X-Signature"]
            del args["X-Signature"]
        return args

    def post(self):
        args = self.get_args()

        response = GRPC_API.getRecord(args)
        if not response.successful:
            return jsonify({"message": f"failed!"})

        return jsonify({"message": f"success!"})

api.add_resource(record, "/record")
