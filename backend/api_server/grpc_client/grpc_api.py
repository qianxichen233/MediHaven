import grpc
from . import mediheaven_pb2
from . import mediheaven_pb2_grpc


class GRPC_API_Client:
    def __init__(self) -> None:
        self.channel = grpc.insecure_channel("localhost:50051")

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
