from flask import Flask, Blueprint, jsonify
from flask_restful import Api, Resource, reqparse
from datetime import datetime, timedelta

import inspect

from grpc_client.grpc_api import GRPC_API

schedule_api = Blueprint("schedule_api", __name__)
api = Api(schedule_api)


class schedule(Resource):
    def __init__(self):
        self.get_parser = reqparse.RequestParser()
        self.get_parser.add_argument(
            "email", type=str, help="email", required=True, location="args"
        )
        self.get_parser.add_argument(
            "timestamp_st", type=str, help="email", required=True, location="args"
        )
        self.get_parser.add_argument(
            "timestamp_ed", type=str, help="email", required=True, location="args"
        )
        self.get_parser.add_argument(
            "issuer_email",
            type=str,
            help="Issuer Email",
            required=True,
            location="args",
        )
        self.get_parser.add_argument(
            "timestamp", type=str, help="Timestamp", required=True, location="args"
        )
        self.get_parser.add_argument(
            "X-Signature", type=str, help="signature", required=True, location="headers"
        )

        self.put_parser = reqparse.RequestParser()
        self.put_parser.add_argument(
            "patient_ID", type=int, help="patient ID", required=True
        )
        self.put_parser.add_argument(
            "physician_ID", type=int, help="physician ID", required=True
        )
        self.put_parser.add_argument(
            "schedule_st", type=str, help="schedule start timestamp", required=True
        )
        self.put_parser.add_argument(
            "schedule_ed", type=str, help="schedule end timestamp", required=True
        )
        self.put_parser.add_argument(
            "created_at", type=str, help="appointment timestamp", required=True
        )
        self.put_parser.add_argument(
            "description", type=str, help="description", required=True
        )
        self.put_parser.add_argument(
            "issuer_email", type=str, help="Issuer Email", required=True
        )
        self.put_parser.add_argument(
            "timestamp", type=str, help="Timestamp", required=True
        )
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

    def put(self):
        args = self.get_args()

        response = GRPC_API.addSchedule(args)
        if not response.successful:
            return jsonify({"message": f"failed!"})

        return jsonify({"message": f"success!"})

    def get(self):
        args = self.get_args()

        response = GRPC_API.getSchedule(args)

        result = []
        for schedule in response.schedules:
            result.append(
                {
                    "patient_ID": schedule.patient_ID,
                    "physician_ID": schedule.physician_ID,
                    "schedule_st": schedule.schedule_st,
                    "schedule_ed": schedule.schedule_ed,
                    "created_at": schedule.created_at,
                    "description": schedule.description,
                    "patient_first_name": schedule.patient_first_name,
                    "patient_last_name": schedule.patient_last_name,
                    "patient_SSN": schedule.patient_SSN,
                }
            )

        return jsonify({"schedules": result})


api.add_resource(schedule, "/schedule")
