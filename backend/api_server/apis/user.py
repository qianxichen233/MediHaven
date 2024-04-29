from flask import Flask, Blueprint, jsonify
from flask_restful import Api, Resource, reqparse
from datetime import datetime, timedelta

import base64
import base36
import json

from xmpp import register_xmpp

import inspect

from grpc_client.grpc_api import GRPC_API
from myRedis import myRedisServer

user_api = Blueprint("user_api", __name__)
api = Api(user_api)


def to_base36(value):
    if isinstance(value, int):
        return base36.dumps(value)
    elif isinstance(value, str):
        return base36.dumps(int.from_bytes(value.encode("utf-8"), "big"))
    else:
        raise ValueError("Invalid input type. Expected int or str.")


class register(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument("Code", type=str, help="Register Code", required=True)
        self.parser.add_argument(
            "Account_Type", type=str, help="Account Type", required=True
        )
        self.parser.add_argument(
            "First_Name", type=str, help="First Name", required=True
        )
        self.parser.add_argument("Last_Name", type=str, help="Last Name", required=True)
        self.parser.add_argument("Sex", type=str, help="Sex", required=True)
        self.parser.add_argument("Age", type=int, help="Age", required=False)
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
        self.parser.add_argument("Title", type=str, help="Phone Number", required=False)
        self.parser.add_argument(
            "Department", type=str, help="Phone Number", required=False
        )
        self.parser.add_argument("Password", type=str, help="Password", required=False)

    def post(self):
        args = self.parser.parse_args()

        password = args["Password"]
        del args["Password"]

        if args["Account_Type"] == "admin" and not hasattr(args, "Age"):
            return jsonify({"message": f"Missing Fields"})

        if args["Account_Type"] == "physician" and (
            not hasattr(args, "Title") or not hasattr(args, "Department")
        ):
            return jsonify({"message": f"Missing Fields"})

        response = GRPC_API.register(args)
        if not response.successful:
            return jsonify({"message": f"failed!"})

        print(response)

        username = args["Account_Type"] + "_" + args["Email"]
        try:
            register_xmpp(username.replace("@", "_at_"), password)
        except:
            return jsonify({"message": f"xmpp failed!"})

        return jsonify({"message": f"success!"})


class login(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument("email", type=str, help="Email address", required=True)
        self.parser.add_argument(
            "account_type", type=str, help="Account Type", required=True
        )
        self.parser.add_argument("timestamp", type=str, help="Timestamp", required=True)
        self.parser.add_argument(
            "X-Signature", type=str, help="signature", required=True, location="headers"
        )

    def post(self):
        args = self.parser.parse_args()
        args.signature = args["X-Signature"]
        del args["X-Signature"]

        response = GRPC_API.login(args)
        if not response.successful:
            if response.msg == "hacker":
                return jsonify({"message": f"hacker"})
            return jsonify({"message": f"failed!"})

        return jsonify({"message": f"success!"})


class code(Resource):
    def __init__(self):
        self.post_parser = reqparse.RequestParser()
        self.post_parser.add_argument(
            "email", type=str, help="Email address", required=True
        )
        self.post_parser.add_argument(
            "account_type", type=str, help="Account Type", required=True
        )
        self.post_parser.add_argument(
            "timestamp", type=str, help="Timestamp", required=True
        )
        self.post_parser.add_argument(
            "X-Signature", type=str, help="signature", required=True, location="headers"
        )

        self.delete_parser = reqparse.RequestParser()
        self.delete_parser.add_argument(
            "email", type=str, help="Email address", required=True
        )
        self.delete_parser.add_argument(
            "code", type=str, help="Code to be deleted", required=True
        )
        self.delete_parser.add_argument(
            "timestamp", type=str, help="Timestamp", required=True
        )
        self.delete_parser.add_argument(
            "X-Signature", type=str, help="signature", required=True, location="headers"
        )

        self.get_parser = reqparse.RequestParser()
        self.get_parser.add_argument(
            "email", type=str, help="Email address", required=True, location="args"
        )
        self.get_parser.add_argument(
            "timestamp", type=str, help="Timestamp", required=True, location="args"
        )
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

        current_time = datetime.now()
        future_time = current_time + timedelta(weeks=1)
        timestamp_str = future_time.strftime("%Y-%m-%d")
        args.expiration_date = timestamp_str

        response = GRPC_API.get_code(args)
        if not response.successful:
            return jsonify({"message": f"failed!"})

        return jsonify({"code": response.code})

    def delete(self):
        args = self.get_args()
        print(args)

        response = GRPC_API.delCode(args)

        if not response.successful:
            return jsonify({"message": f"failed!"})

        return jsonify({"message": "success!"})

    def get(self):
        args = self.get_args()

        response = GRPC_API.listCode(args)
        result = []
        for code in response.codes:
            result.append(
                {
                    "code": code.code,
                    "account_type": code.account_type,
                    "expiration_date": code.expiration_date,
                }
            )

        return jsonify({"codes": result})


class patient(Resource):
    def __init__(self):
        self.post_parser = reqparse.RequestParser()
        self.post_parser.add_argument("SSN", type=str, help="SSN", required=True)
        self.post_parser.add_argument(
            "First_Name", type=str, help="First Name", required=True
        )
        self.post_parser.add_argument(
            "Last_Name", type=str, help="Last Name", required=True
        )
        self.post_parser.add_argument(
            "Insurance_ID", type=str, help="Insurance ID", required=True
        )
        self.post_parser.add_argument("Sex", type=str, help="Sex", required=True)
        self.post_parser.add_argument(
            "Date_Of_Birth", type=str, help="Date Of Birth", required=True
        )
        self.post_parser.add_argument(
            "Phone_Number", type=str, help="Phone Number", required=True
        )
        self.post_parser.add_argument("Email", type=str, help="Email", required=True)

        self.post_parser.add_argument(
            "issuer_email", type=str, help="issuer email", required=True
        )
        self.post_parser.add_argument(
            "timestamp", type=str, help="timestamp", required=True
        )
        self.post_parser.add_argument(
            "X-Signature", type=str, help="signature", required=True, location="headers"
        )

        self.get_parser = reqparse.RequestParser()
        self.get_parser.add_argument(
            "SSN", type=str, help="SSN", required=True, location="args"
        )
        self.get_parser.add_argument(
            "issuer_email",
            type=str,
            help="issuer email",
            required=True,
            location="args",
        )
        self.get_parser.add_argument(
            "timestamp", type=str, help="timestamp", required=True, location="args"
        )
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

    def get(self):
        args = self.get_args()

        response = GRPC_API.get_patient(args)
        # print(f"response: {response.patient} ---- end")
        if response.patient.SSN == "":
            return jsonify({"message": f"failed!"})

        result = {}
        result["SSN"] = response.patient.SSN
        result["First_Name"] = response.patient.First_Name
        result["Last_Name"] = response.patient.Last_Name
        result["Insurance_ID"] = response.patient.Insurance_ID
        result["Sex"] = response.patient.Sex
        result["Date_Of_Birth"] = response.patient.Date_Of_Birth
        result["Phone_Number"] = response.patient.Phone_Number
        result["Email"] = response.patient.Email
        result["ID"] = response.patient.ID

        return jsonify({"patient": result})

    def post(self):
        args = self.get_args()

        response = GRPC_API.add_patient(args)
        if not response.successful:
            return jsonify({"message": f"failed!"})

        return jsonify({"message": f"success!"})


class physician(Resource):
    def __init__(self):
        self.get_parser = reqparse.RequestParser()
        self.get_parser.add_argument(
            "department", type=str, help="department", location="args"
        )
        self.get_parser.add_argument("name", type=str, help="name", location="args")

    def get(self):
        args = self.get_parser.parse_args()

        key = f"{args["department"]}-{args["name"]}"

        cache = myRedisServer.get(key)

        if(cache != None):
            cache = json.loads(cache)
            print(f"cache: {cache}")
            return jsonify({"physicians": cache})

        if args["name"] != None:
            [first_name, last_name] = args["name"].split(" ")
            args.first_name = first_name
            args.last_name = last_name

        del args["name"]

        response = GRPC_API.get_physician(args)

        print(response)

        result = []
        for physician in response.physicians:
            result.append(
                {
                    "ID": physician.ID,
                    "first_name": physician.first_name,
                    "last_name": physician.last_name,
                    "sex": physician.sex,
                    "department": physician.department,
                    "title": physician.title,
                    "email": physician.email,
                }
            )

        try:
            myRedisServer.set(key, json.dumps(result))
        except:
            print("redis set failed!")

        return jsonify({"physicians": result})


api.add_resource(register, "/register")
api.add_resource(login, "/login")
api.add_resource(code, "/code")
api.add_resource(patient, "/patient")
api.add_resource(physician, "/physician")
