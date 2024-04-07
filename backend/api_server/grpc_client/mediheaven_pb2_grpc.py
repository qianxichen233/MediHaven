# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

from . import mediheaven_pb2 as mediheaven__pb2


class CodeStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.getCode = channel.unary_unary(
                '/mediheaven.Code/getCode',
                request_serializer=mediheaven__pb2.CodeRequest.SerializeToString,
                response_deserializer=mediheaven__pb2.CodeResponse.FromString,
                )
        self.delCode = channel.unary_unary(
                '/mediheaven.Code/delCode',
                request_serializer=mediheaven__pb2.CodeDelRequest.SerializeToString,
                response_deserializer=mediheaven__pb2.SuccessResponse.FromString,
                )
        self.listCode = channel.unary_unary(
                '/mediheaven.Code/listCode',
                request_serializer=mediheaven__pb2.CodeListRequest.SerializeToString,
                response_deserializer=mediheaven__pb2.CodeListResponse.FromString,
                )


class CodeServicer(object):
    """Missing associated documentation comment in .proto file."""

    def getCode(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def delCode(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def listCode(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_CodeServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'getCode': grpc.unary_unary_rpc_method_handler(
                    servicer.getCode,
                    request_deserializer=mediheaven__pb2.CodeRequest.FromString,
                    response_serializer=mediheaven__pb2.CodeResponse.SerializeToString,
            ),
            'delCode': grpc.unary_unary_rpc_method_handler(
                    servicer.delCode,
                    request_deserializer=mediheaven__pb2.CodeDelRequest.FromString,
                    response_serializer=mediheaven__pb2.SuccessResponse.SerializeToString,
            ),
            'listCode': grpc.unary_unary_rpc_method_handler(
                    servicer.listCode,
                    request_deserializer=mediheaven__pb2.CodeListRequest.FromString,
                    response_serializer=mediheaven__pb2.CodeListResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'mediheaven.Code', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Code(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def getCode(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mediheaven.Code/getCode',
            mediheaven__pb2.CodeRequest.SerializeToString,
            mediheaven__pb2.CodeResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def delCode(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mediheaven.Code/delCode',
            mediheaven__pb2.CodeDelRequest.SerializeToString,
            mediheaven__pb2.SuccessResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def listCode(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mediheaven.Code/listCode',
            mediheaven__pb2.CodeListRequest.SerializeToString,
            mediheaven__pb2.CodeListResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class AccountStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.register = channel.unary_unary(
                '/mediheaven.Account/register',
                request_serializer=mediheaven__pb2.RegisterRequest.SerializeToString,
                response_deserializer=mediheaven__pb2.SuccessResponse.FromString,
                )
        self.Login = channel.unary_unary(
                '/mediheaven.Account/Login',
                request_serializer=mediheaven__pb2.LoginRequest.SerializeToString,
                response_deserializer=mediheaven__pb2.LoginResponse.FromString,
                )
        self.patient = channel.unary_unary(
                '/mediheaven.Account/patient',
                request_serializer=mediheaven__pb2.PatientRequest.SerializeToString,
                response_deserializer=mediheaven__pb2.SuccessResponse.FromString,
                )


class AccountServicer(object):
    """Missing associated documentation comment in .proto file."""

    def register(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def Login(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def patient(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_AccountServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'register': grpc.unary_unary_rpc_method_handler(
                    servicer.register,
                    request_deserializer=mediheaven__pb2.RegisterRequest.FromString,
                    response_serializer=mediheaven__pb2.SuccessResponse.SerializeToString,
            ),
            'Login': grpc.unary_unary_rpc_method_handler(
                    servicer.Login,
                    request_deserializer=mediheaven__pb2.LoginRequest.FromString,
                    response_serializer=mediheaven__pb2.LoginResponse.SerializeToString,
            ),
            'patient': grpc.unary_unary_rpc_method_handler(
                    servicer.patient,
                    request_deserializer=mediheaven__pb2.PatientRequest.FromString,
                    response_serializer=mediheaven__pb2.SuccessResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'mediheaven.Account', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Account(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def register(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mediheaven.Account/register',
            mediheaven__pb2.RegisterRequest.SerializeToString,
            mediheaven__pb2.SuccessResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def Login(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mediheaven.Account/Login',
            mediheaven__pb2.LoginRequest.SerializeToString,
            mediheaven__pb2.LoginResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def patient(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mediheaven.Account/patient',
            mediheaven__pb2.PatientRequest.SerializeToString,
            mediheaven__pb2.SuccessResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class MedicalRecordStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.getRecord = channel.unary_unary(
                '/mediheaven.MedicalRecord/getRecord',
                request_serializer=mediheaven__pb2.getRecordRequest.SerializeToString,
                response_deserializer=mediheaven__pb2.RecordResponse.FromString,
                )
        self.writeRecord = channel.unary_unary(
                '/mediheaven.MedicalRecord/writeRecord',
                request_serializer=mediheaven__pb2.writeRecordRequest.SerializeToString,
                response_deserializer=mediheaven__pb2.SuccessResponse.FromString,
                )


class MedicalRecordServicer(object):
    """Missing associated documentation comment in .proto file."""

    def getRecord(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def writeRecord(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_MedicalRecordServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'getRecord': grpc.unary_unary_rpc_method_handler(
                    servicer.getRecord,
                    request_deserializer=mediheaven__pb2.getRecordRequest.FromString,
                    response_serializer=mediheaven__pb2.RecordResponse.SerializeToString,
            ),
            'writeRecord': grpc.unary_unary_rpc_method_handler(
                    servicer.writeRecord,
                    request_deserializer=mediheaven__pb2.writeRecordRequest.FromString,
                    response_serializer=mediheaven__pb2.SuccessResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'mediheaven.MedicalRecord', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class MedicalRecord(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def getRecord(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mediheaven.MedicalRecord/getRecord',
            mediheaven__pb2.getRecordRequest.SerializeToString,
            mediheaven__pb2.RecordResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def writeRecord(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/mediheaven.MedicalRecord/writeRecord',
            mediheaven__pb2.writeRecordRequest.SerializeToString,
            mediheaven__pb2.SuccessResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
