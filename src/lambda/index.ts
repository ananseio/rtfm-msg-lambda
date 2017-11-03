import { CreateDeviceHandler } from './api/device/create-device';
import { DeleteDeviceHandler } from './api/device/delete-device';
import { GetDeviceHandler } from './api/device/get-device';
import { ListDeviceHandler } from './api/device/list-device';
import { UpdateDeviceHandler } from './api/device/update-device';

import { CreateProfileHandler } from './api/profile/create-profile';
import { DeleteProfileHandler } from './api/profile/delete-profile';
import { GetProfileHandler } from './api/profile/get-profile';
import { ListProfileHandler } from './api/profile/list-profile';
import { UpdateProfileHandler } from './api/profile/update-profile';

import { CreateRecordHandler } from './api/record/create-record';
import { DeleteRecordHandler } from './api/record/delete-record';
import { GetRecordHandler } from './api/record/get-record';
import { ListRecordHandler } from './api/record/list-record';
import { UpdateRecordHandler } from './api/record/update-record';

import { CreateUserHandler } from './api/user/create-user';
import { CreateCustomerHandler } from './internal/customer/create-customer';

import { RequestAttachPolicyHandler } from './api/request-attach-policy';

export = {
  createDevice: CreateDeviceHandler.handler,
  deleteDevice: DeleteDeviceHandler.handler,
  getDevice: GetDeviceHandler.handler,
  listDevice: ListDeviceHandler.handler,
  updateDevice: UpdateDeviceHandler.handler,
  createProfile: CreateProfileHandler.handler,
  deleteProfile: DeleteProfileHandler.handler,
  getProfile: GetProfileHandler.handler,
  listProfile: ListProfileHandler.handler,
  updateProfile: UpdateProfileHandler.handler,
  createRecord: CreateRecordHandler.handler,
  deleteRecord: DeleteRecordHandler.handler,
  getRecord: GetRecordHandler.handler,
  listRecord: ListRecordHandler.handler,
  updateRecord: UpdateRecordHandler.handler,
  createUser: CreateUserHandler.handler,
  createCustomer: CreateCustomerHandler.handler,
  requestAttachPolicy: RequestAttachPolicyHandler.handler,
};
