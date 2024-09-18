import {
  activateResultSchema,
  applyCouponResultSchema,
  createResultSchema,
} from './schema';
import { inheritanceSyncPlansService } from './sync';

import { makePostRequest, runAndHandleServerErrors } from '../../utils';
import { inheritanceBaseUrl } from '../common';
import { inheritanceEditPlansService } from './edit';

export {
  type InheritancePlanCreateResponse,
  type InheritancePlanActivateResponse,
  type InheritancePlanApplyCouponResponse,
} from './schema';

export * from './sync';
export * from './edit';

const baseUrl = `${inheritanceBaseUrl}/wallet-account`;
const couponBaseUrl = `${inheritanceBaseUrl}/wallet-recovery`;

const create = async (params: { encryptedData: string; accessToken: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      createResultSchema,
      `${baseUrl}/info/message`,
      {
        encryptedData: params.encryptedData,
      },
      params.accessToken,
    ),
  );

const applyCoupon = async (params: { coupon: string; accessToken: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      applyCouponResultSchema,
      `${couponBaseUrl}/activate`,
      {
        coupon: params.coupon,
      },
      params.accessToken,
    ),
  );

const activate = async (params: { coupon: string; accessToken: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      activateResultSchema,
      `${couponBaseUrl}/activate`,
      {
        coupon: params.coupon,
      },
      params.accessToken,
    ),
  );

export const inheritancePlanService = {
  create,
  applyCoupon,
  activate,
  sync: inheritanceSyncPlansService,
  edit: inheritanceEditPlansService,
};
