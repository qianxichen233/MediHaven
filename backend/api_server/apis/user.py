from flask import Flask, Blueprint, jsonify
from flask_restful import Api, Resource, reqparse

from grpc_client.grpc_api import GRPC_API

user_api = Blueprint("user_api", __name__)
api = Api(user_api)


class register(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument("Code", type=str, help="Register Code", required=True)
        self.parser.add_argument("Type", type=str, help="Account Type", required=True)
        self.parser.add_argument(
            "First_Name", type=str, help="First Name", required=True
        )
        self.parser.add_argument("Last_Name", type=str, help="Last Name", required=True)
        self.parser.add_argument("Sex", type=str, help="Sex", required=True)
        self.parser.add_argument("Age", type=int, help="Age", required=True)
        self.parser.add_argument(
            "Date_Of_Birth", type=str, help="Date Of Birth", required=True
        )
        self.parser.add_argument(
            "Phone_Number", type=str, help="Phone Number", required=True
        )
        self.parser.add_argument("Email", type=str, help="Email", required=True)
        self.parser.add_argument(
            "Pub_key", type=str, help="RSA Public Key", required=True
        )

    def post(self):
        args = self.parser.parse_args()

        print(GRPC_API.register(args))

        return jsonify({"message": f"success!"})


class login(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument("email", type=str, help="Email address", required=True)
        self.parser.add_argument("type", type=str, help="Account Type", required=True)
        self.parser.add_argument("signature", type=str, help="signature", required=True)

    def post(self):
        args = self.parser.parse_args()

        print(GRPC_API.login(args))

        return jsonify({"message": f"success!"})


api.add_resource(register, "/register")
api.add_resource(login, "/login")
