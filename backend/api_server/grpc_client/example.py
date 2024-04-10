import grpc
import mediheaven_pb2
import mediheaven_pb2_grpc


def run():
    # Establish a connection with the gRPC server
    channel = grpc.insecure_channel("localhost:50051")
    # Create a stub (client) for the service
    stub = mediheaven_pb2_grpc.CodeStub(channel)
    # Create a request message
    request = mediheaven_pb2.CodeRequest(AccountType="admin", signature="test")
    # Call the remote method
    response = stub.getCode(request)
    # Print the response
    print(f"Response: {response.code}, {response.successful}")


if __name__ == "__main__":
    run()
