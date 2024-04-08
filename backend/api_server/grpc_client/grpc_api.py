import grpc
from . import mediheaven_pb2
from . import mediheaven_pb2_grpc


class GRPC_API_Client:
    def __init__(self) -> None:
        self.channel = grpc.insecure_channel("localhost:50051")
    
    def getAuth(self, request):
        auth = mediheaven_pb2.Auth(issuer_email=request["issuer_email"], timestamp=request["timestamp"], signature=request["signature"])

        del request["issuer_email"]
        del request["timestamp"]
        del request["signature"]

        return auth

    def register(self, request):
        stub = mediheaven_pb2_grpc.AccountStub(self.channel)
        request = mediheaven_pb2.RegisterRequest(**request)
        response = stub.register(request)
        return response

    def login(self, request):
        stub = mediheaven_pb2_grpc.AccountStub(self.channel)
        request = mediheaven_pb2.LoginRequest(**request)
        response = stub.Login(request)
        return response
    
    def add_patient(self, request):
        stub = mediheaven_pb2_grpc.AccountStub(self.channel)
        auth = self.getAuth(request)
        request = mediheaven_pb2.PatientRequest(**request, auth=auth)
        response = stub.patient(request)
        return response
    
    def get_patient(self, request):
        stub = mediheaven_pb2_grpc.AccountStub(self.channel)
        auth = self.getAuth(request)
        request = mediheaven_pb2.getPatientRequest(**request, auth=auth)
        response = stub.getPatient(request)
        return response

    def get_code(self, request):
        stub = mediheaven_pb2_grpc.CodeStub(self.channel)
        request = mediheaven_pb2.CodeRequest(**request)
        response = stub.getCode(request)
        return response

    def delCode(self, request):
        stub = mediheaven_pb2_grpc.CodeStub(self.channel)
        request = mediheaven_pb2.CodeDelRequest(**request)
        response = stub.delCode(request)
        return response

    def listCode(self, request):
        stub = mediheaven_pb2_grpc.CodeStub(self.channel)
        request = mediheaven_pb2.CodeListRequest(**request)
        response = stub.listCode(request)
        return response
    
    def getRecord(self, request):
        stub = mediheaven_pb2_grpc.MedicalRecordStub(self.channel)
        auth = self.getAuth(request)
        request = mediheaven_pb2.getRecordRequest(**request, auth=auth)
        response = stub.getRecord(request)
        return response
    
    def addRecord(self, request):
        stub = mediheaven_pb2_grpc.MedicalRecordStub(self.channel)
        auth = self.getAuth(request)
        SSN = request["SSN"]
        del request["SSN"]

        record = mediheaven_pb2.SingleRecord(**request)

        request = mediheaven_pb2.writeRecordRequest(SSN=SSN, record=record, auth=auth)
        response = stub.writeRecord(request)
        return response

    def test(self):
        # Create a stub (client) for the service
        stub = mediheaven_pb2_grpc.CodeStub(self.channel)
        # Create a request message
        request = mediheaven_pb2.CodeRequest(AccountType="admin", signature="test")
        # Call the remote method
        response = stub.getCode(request)
        # Print the response
        print(f"Response: {response.code}, {response.successful}")


GRPC_API = GRPC_API_Client()
