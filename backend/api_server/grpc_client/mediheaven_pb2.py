# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: mediheaven.proto
# Protobuf Python Version: 4.25.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x10mediheaven.proto\x12\nmediheaven\"B\n\x04\x41uth\x12\x14\n\x0cissuer_email\x18\x01 \x01(\t\x12\x11\n\ttimestamp\x18\x02 \x01(\t\x12\x11\n\tsignature\x18\x03 \x01(\t\"q\n\x0b\x43odeRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x14\n\x0c\x61\x63\x63ount_type\x18\x04 \x01(\t\x12\x11\n\ttimestamp\x18\x05 \x01(\t\x12\x11\n\tsignature\x18\x02 \x01(\t\x12\x17\n\x0f\x65xpiration_date\x18\x03 \x01(\t\"J\n\x0c\x43odeResponse\x12\x12\n\nsuccessful\x18\x01 \x01(\x08\x12\x0c\n\x04\x63ode\x18\x02 \x01(\t\x12\x10\n\x03msg\x18\x03 \x01(\tH\x00\x88\x01\x01\x42\x06\n\x04_msg\"S\n\x0e\x43odeDelRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x0c\n\x04\x63ode\x18\x02 \x01(\t\x12\x11\n\ttimestamp\x18\x03 \x01(\t\x12\x11\n\tsignature\x18\x04 \x01(\t\"F\n\x0f\x43odeListRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x11\n\ttimestamp\x18\x02 \x01(\t\x12\x11\n\tsignature\x18\x03 \x01(\t\"T\n\x10\x43odeListResponse\x12&\n\x05\x63odes\x18\x01 \x03(\x0b\x32\x17.mediheaven.CodeMessage\x12\x10\n\x03msg\x18\x02 \x01(\tH\x00\x88\x01\x01\x42\x06\n\x04_msg\"J\n\x0b\x43odeMessage\x12\x14\n\x0c\x61\x63\x63ount_type\x18\x01 \x01(\t\x12\x0c\n\x04\x63ode\x18\x02 \x01(\t\x12\x17\n\x0f\x65xpiration_date\x18\x03 \x01(\t\"\xe6\x01\n\x0fRegisterRequest\x12\x0c\n\x04\x43ode\x18\x01 \x01(\t\x12\x14\n\x0c\x41\x63\x63ount_Type\x18\x02 \x01(\t\x12\x12\n\nFirst_Name\x18\x03 \x01(\t\x12\x11\n\tLast_Name\x18\x04 \x01(\t\x12\x0b\n\x03Sex\x18\x05 \x01(\t\x12\x0b\n\x03\x41ge\x18\x06 \x01(\x05\x12\x15\n\rDate_Of_Birth\x18\x07 \x01(\t\x12\x14\n\x0cPhone_Number\x18\x08 \x01(\t\x12\r\n\x05\x45mail\x18\t \x01(\t\x12\x0f\n\x07Pub_key\x18\n \x01(\t\x12\r\n\x05Title\x18\x0b \x01(\t\x12\x12\n\nDepartment\x18\x0c \x01(\t\"?\n\x0fSuccessResponse\x12\x12\n\nsuccessful\x18\x01 \x01(\x08\x12\x10\n\x03msg\x18\x02 \x01(\tH\x00\x88\x01\x01\x42\x06\n\x04_msg\"Y\n\x0cLoginRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x11\n\ttimestamp\x18\x04 \x01(\t\x12\x11\n\tsignature\x18\x02 \x01(\t\x12\x14\n\x0c\x61\x63\x63ount_type\x18\x03 \x01(\t\"N\n\rLoginResponse\x12\x12\n\nsuccessful\x18\x01 \x01(\x08\x12\x0f\n\x07pub_key\x18\x02 \x01(\t\x12\x10\n\x03msg\x18\x03 \x01(\tH\x00\x88\x01\x01\x42\x06\n\x04_msg\"\xc3\x01\n\x0ePatientRequest\x12\x0b\n\x03SSN\x18\x01 \x01(\t\x12\x12\n\nFirst_Name\x18\x02 \x01(\t\x12\x11\n\tLast_Name\x18\x03 \x01(\t\x12\x14\n\x0cInsurance_ID\x18\x04 \x01(\t\x12\x0b\n\x03Sex\x18\x05 \x01(\t\x12\x15\n\rDate_Of_Birth\x18\x06 \x01(\t\x12\x14\n\x0cPhone_Number\x18\x07 \x01(\t\x12\r\n\x05\x45mail\x18\x08 \x01(\t\x12\x1e\n\x04\x61uth\x18\t \x01(\x0b\x32\x10.mediheaven.Auth\"@\n\x11getPatientRequest\x12\x0b\n\x03SSN\x18\x01 \x01(\t\x12\x1e\n\x04\x61uth\x18\x02 \x01(\x0b\x32\x10.mediheaven.Auth\"\xac\x01\n\x0bPatientInfo\x12\x0b\n\x03SSN\x18\x01 \x01(\t\x12\x12\n\nFirst_Name\x18\x02 \x01(\t\x12\x11\n\tLast_Name\x18\x03 \x01(\t\x12\x14\n\x0cInsurance_ID\x18\x04 \x01(\t\x12\x0b\n\x03Sex\x18\x05 \x01(\t\x12\x15\n\rDate_Of_Birth\x18\x06 \x01(\t\x12\x14\n\x0cPhone_Number\x18\x07 \x01(\t\x12\r\n\x05\x45mail\x18\x08 \x01(\t\x12\n\n\x02ID\x18\t \x01(\x05\"L\n\x0fPatientResponse\x12-\n\x07patient\x18\x01 \x01(\x0b\x32\x17.mediheaven.PatientInfoH\x00\x88\x01\x01\x42\n\n\x08_patient\"\x8b\x01\n\x13getPhysicianRequest\x12\x17\n\ndepartment\x18\x01 \x01(\tH\x00\x88\x01\x01\x12\x17\n\nfirst_name\x18\x02 \x01(\tH\x01\x88\x01\x01\x12\x16\n\tlast_name\x18\x03 \x01(\tH\x02\x88\x01\x01\x42\r\n\x0b_departmentB\r\n\x0b_first_nameB\x0c\n\n_last_name\"\x81\x01\n\rPhysicianInfo\x12\n\n\x02ID\x18\x01 \x01(\x05\x12\x12\n\nfirst_name\x18\x02 \x01(\t\x12\x11\n\tlast_name\x18\x03 \x01(\t\x12\x0b\n\x03sex\x18\x04 \x01(\t\x12\x12\n\ndepartment\x18\x05 \x01(\t\x12\r\n\x05title\x18\x06 \x01(\t\x12\r\n\x05\x65mail\x18\x07 \x01(\t\"B\n\x11PhysicianResponse\x12-\n\nphysicians\x18\x01 \x03(\x0b\x32\x19.mediheaven.PhysicianInfo\"\x90\x01\n\x0cSingleRecord\x12\x12\n\npatient_id\x18\x01 \x01(\x05\x12\x14\n\x0cphysician_id\x18\x02 \x01(\x05\x12\x11\n\tmedicines\x18\x03 \x03(\t\x12\x15\n\rcomplete_date\x18\x04 \x01(\t\x12\x19\n\x11\x65ncounter_summary\x18\x05 \x01(\t\x12\x11\n\tdiagnosis\x18\x06 \x01(\t\"F\n\x10getRecordRequest\x12\x12\n\npatient_id\x18\x01 \x01(\x05\x12\x1e\n\x04\x61uth\x18\x02 \x01(\x0b\x32\x10.mediheaven.Auth\"U\n\x0eRecordResponse\x12)\n\x07records\x18\x01 \x03(\x0b\x32\x18.mediheaven.SingleRecord\x12\x10\n\x03msg\x18\x02 \x01(\tH\x00\x88\x01\x01\x42\x06\n\x04_msg\"k\n\x12writeRecordRequest\x12\x0b\n\x03SSN\x18\x01 \x01(\t\x12(\n\x06record\x18\x02 \x01(\x0b\x32\x18.mediheaven.SingleRecord\x12\x1e\n\x04\x61uth\x18\x03 \x01(\x0b\x32\x10.mediheaven.Auth\"\xfb\x01\n\x0esingleSchedule\x12\x12\n\npatient_ID\x18\x01 \x01(\x05\x12\x14\n\x0cphysician_ID\x18\x02 \x01(\x05\x12\x13\n\x0bschedule_st\x18\x03 \x01(\t\x12\x13\n\x0bschedule_ed\x18\x04 \x01(\t\x12\x12\n\ncreated_at\x18\x05 \x01(\t\x12\x13\n\x0b\x64\x65scription\x18\x06 \x01(\t\x12\x1f\n\x12patient_first_name\x18\x07 \x01(\tH\x00\x88\x01\x01\x12\x1e\n\x11patient_last_name\x18\x08 \x01(\tH\x01\x88\x01\x01\x42\x15\n\x13_patient_first_nameB\x14\n\x12_patient_last_name\"b\n\x12\x61\x64\x64ScheduleRequest\x12,\n\x08schedule\x18\x01 \x01(\x0b\x32\x1a.mediheaven.singleSchedule\x12\x1e\n\x04\x61uth\x18\x02 \x01(\x0b\x32\x10.mediheaven.Auth\"o\n\x12getScheduleRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x14\n\x0ctimestamp_st\x18\x02 \x01(\t\x12\x14\n\x0ctimestamp_ed\x18\x03 \x01(\t\x12\x1e\n\x04\x61uth\x18\x04 \x01(\x0b\x32\x10.mediheaven.Auth\"[\n\x10scheduleResponse\x12-\n\tschedules\x18\x01 \x03(\x0b\x32\x1a.mediheaven.singleSchedule\x12\x10\n\x03msg\x18\x02 \x01(\tH\x00\x88\x01\x01\x42\x06\n\x04_msg2\xcf\x01\n\x04\x43ode\x12<\n\x07getCode\x12\x17.mediheaven.CodeRequest\x1a\x18.mediheaven.CodeResponse\x12\x42\n\x07\x64\x65lCode\x12\x1a.mediheaven.CodeDelRequest\x1a\x1b.mediheaven.SuccessResponse\x12\x45\n\x08listCode\x12\x1b.mediheaven.CodeListRequest\x1a\x1c.mediheaven.CodeListResponse2\xeb\x02\n\x07\x41\x63\x63ount\x12\x44\n\x08register\x12\x1b.mediheaven.RegisterRequest\x1a\x1b.mediheaven.SuccessResponse\x12<\n\x05Login\x12\x18.mediheaven.LoginRequest\x1a\x19.mediheaven.LoginResponse\x12\x42\n\x07patient\x12\x1a.mediheaven.PatientRequest\x1a\x1b.mediheaven.SuccessResponse\x12H\n\ngetPatient\x12\x1d.mediheaven.getPatientRequest\x1a\x1b.mediheaven.PatientResponse\x12N\n\x0cgetPhysician\x12\x1f.mediheaven.getPhysicianRequest\x1a\x1d.mediheaven.PhysicianResponse2\xa2\x01\n\rMedicalRecord\x12\x45\n\tgetRecord\x12\x1c.mediheaven.getRecordRequest\x1a\x1a.mediheaven.RecordResponse\x12J\n\x0bwriteRecord\x12\x1e.mediheaven.writeRecordRequest\x1a\x1b.mediheaven.SuccessResponse2\xa3\x01\n\x08Schedule\x12J\n\x0b\x61\x64\x64Schedule\x12\x1e.mediheaven.addScheduleRequest\x1a\x1b.mediheaven.SuccessResponse\x12K\n\x0bgetSchedule\x12\x1e.mediheaven.getScheduleRequest\x1a\x1c.mediheaven.scheduleResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'mediheaven_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_AUTH']._serialized_start=32
  _globals['_AUTH']._serialized_end=98
  _globals['_CODEREQUEST']._serialized_start=100
  _globals['_CODEREQUEST']._serialized_end=213
  _globals['_CODERESPONSE']._serialized_start=215
  _globals['_CODERESPONSE']._serialized_end=289
  _globals['_CODEDELREQUEST']._serialized_start=291
  _globals['_CODEDELREQUEST']._serialized_end=374
  _globals['_CODELISTREQUEST']._serialized_start=376
  _globals['_CODELISTREQUEST']._serialized_end=446
  _globals['_CODELISTRESPONSE']._serialized_start=448
  _globals['_CODELISTRESPONSE']._serialized_end=532
  _globals['_CODEMESSAGE']._serialized_start=534
  _globals['_CODEMESSAGE']._serialized_end=608
  _globals['_REGISTERREQUEST']._serialized_start=611
  _globals['_REGISTERREQUEST']._serialized_end=841
  _globals['_SUCCESSRESPONSE']._serialized_start=843
  _globals['_SUCCESSRESPONSE']._serialized_end=906
  _globals['_LOGINREQUEST']._serialized_start=908
  _globals['_LOGINREQUEST']._serialized_end=997
  _globals['_LOGINRESPONSE']._serialized_start=999
  _globals['_LOGINRESPONSE']._serialized_end=1077
  _globals['_PATIENTREQUEST']._serialized_start=1080
  _globals['_PATIENTREQUEST']._serialized_end=1275
  _globals['_GETPATIENTREQUEST']._serialized_start=1277
  _globals['_GETPATIENTREQUEST']._serialized_end=1341
  _globals['_PATIENTINFO']._serialized_start=1344
  _globals['_PATIENTINFO']._serialized_end=1516
  _globals['_PATIENTRESPONSE']._serialized_start=1518
  _globals['_PATIENTRESPONSE']._serialized_end=1594
  _globals['_GETPHYSICIANREQUEST']._serialized_start=1597
  _globals['_GETPHYSICIANREQUEST']._serialized_end=1736
  _globals['_PHYSICIANINFO']._serialized_start=1739
  _globals['_PHYSICIANINFO']._serialized_end=1868
  _globals['_PHYSICIANRESPONSE']._serialized_start=1870
  _globals['_PHYSICIANRESPONSE']._serialized_end=1936
  _globals['_SINGLERECORD']._serialized_start=1939
  _globals['_SINGLERECORD']._serialized_end=2083
  _globals['_GETRECORDREQUEST']._serialized_start=2085
  _globals['_GETRECORDREQUEST']._serialized_end=2155
  _globals['_RECORDRESPONSE']._serialized_start=2157
  _globals['_RECORDRESPONSE']._serialized_end=2242
  _globals['_WRITERECORDREQUEST']._serialized_start=2244
  _globals['_WRITERECORDREQUEST']._serialized_end=2351
  _globals['_SINGLESCHEDULE']._serialized_start=2354
  _globals['_SINGLESCHEDULE']._serialized_end=2605
  _globals['_ADDSCHEDULEREQUEST']._serialized_start=2607
  _globals['_ADDSCHEDULEREQUEST']._serialized_end=2705
  _globals['_GETSCHEDULEREQUEST']._serialized_start=2707
  _globals['_GETSCHEDULEREQUEST']._serialized_end=2818
  _globals['_SCHEDULERESPONSE']._serialized_start=2820
  _globals['_SCHEDULERESPONSE']._serialized_end=2911
  _globals['_CODE']._serialized_start=2914
  _globals['_CODE']._serialized_end=3121
  _globals['_ACCOUNT']._serialized_start=3124
  _globals['_ACCOUNT']._serialized_end=3487
  _globals['_MEDICALRECORD']._serialized_start=3490
  _globals['_MEDICALRECORD']._serialized_end=3652
  _globals['_SCHEDULE']._serialized_start=3655
  _globals['_SCHEDULE']._serialized_end=3818
# @@protoc_insertion_point(module_scope)
