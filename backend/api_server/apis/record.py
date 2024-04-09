from flask import Flask, Blueprint, jsonify
from flask_restful import Api, Resource, reqparse
from datetime import datetime, timedelta

import inspect

from grpc_client.grpc_api import GRPC_API

record_api = Blueprint("record_api", __name__)
api = Api(record_api)


class record(Resource):
    def __init__(self):
        self.get_parser = reqparse.RequestParser()
        self.get_parser.add_argument("patient_id", type=int, help="patient id", required=True, location="args")
        self.get_parser.add_argument("issuer_email", type=str, help="Issuer Email", required=True, location="args")
        self.get_parser.add_argument("timestamp", type=str, help="Timestamp", required=True, location="args")
        self.get_parser.add_argument(
            "X-Signature", type=str, help="signature", required=True, location="headers"
        )

        self.put_parser = reqparse.RequestParser()
        self.put_parser.add_argument("SSN", type=str, help="SSN", required=True)
        self.put_parser.add_argument("patient_id", type=int, help="patient id", required=True)
        self.put_parser.add_argument("physician_id", type=int, help="physician id", required=True)
        self.put_parser.add_argument("medicines", type=str, action='append', help="medicines", required=True)
        self.put_parser.add_argument("complete_date", type=str, help="complete date", required=True)
        self.put_parser.add_argument("encounter_summary", type=str, help="encounter summary", required=True)
        self.put_parser.add_argument("diagnosis", type=str, help="diagnosis", required=True)
        self.put_parser.add_argument("issuer_email", type=str, help="Issuer Email", required=True)
        self.put_parser.add_argument("timestamp", type=str, help="Timestamp", required=True)
        self.put_parser.add_argument(
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

        response = GRPC_API.getRecord(args)
        result = []
        for record in response.records:
            medicines = []
            if record.medicines != None:
                for medicine in record.medicines:
                    medicines.append(medicine)

            result.append({
                "patient_id": record.patient_id,
                "physician_id": record.physician_id,
                "medicines": medicines,
                "complete_date": record.complete_date,
                "encounter_summary": record.encounter_summary,
                "diagnosis": record.diagnosis
            })

        return jsonify({"records": result})
    
    def put(self):
        args = self.get_args()

        response = GRPC_API.addRecord(args)
        if not response.successful:
            return jsonify({"message": f"failed!"})

        return jsonify({"message": f"success!"})

api.add_resource(record, "/record")
