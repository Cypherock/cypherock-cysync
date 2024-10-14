import { inheritanceEditPlansService } from './edit';
import { inheritanceRecoverPlansService } from './recover';
import {
  activateResultSchema,
  applyCouponResultSchema,
  checkCouponResultSchema,
  createResultSchema,
  getPlanResultSchema,
} from './schema';
import { inheritanceSyncPlansService } from './sync';

import {
  makeGetRequest,
  makePostRequest,
  runAndHandleServerErrors,
} from '../../utils';
import { inheritanceBaseUrl } from '../common';

export {
  type InheritancePlanCreateResponse,
  type InheritancePlanActivateResponse,
  type InheritancePlanApplyCouponResponse,
} from './schema';

export * from './sync';
export * from './edit';

const baseUrl = `${inheritanceBaseUrl}/wallet-account`;
const couponBaseUrl = `${inheritanceBaseUrl}/wallet-recovery`;

const create = async (params: {
  encryptedData: string;
  sessionId: string;
  accessToken: string;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      createResultSchema,
      `${baseUrl}/info/message`,
      {
        encryptedData: params.encryptedData,
        sessionId: params.sessionId,
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

const checkCoupon = async (params: { coupon: string; accessToken: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      checkCouponResultSchema,
      `${couponBaseUrl}/check-coupon`,
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

const getPlan = async (params: { accessToken: string }) =>
  runAndHandleServerErrors(() =>
    makeGetRequest(getPlanResultSchema, `${baseUrl}/list`, params.accessToken),
  );

export const inheritancePlanService = {
  create,
  checkCoupon,
  applyCoupon,
  activate,
  sync: inheritanceSyncPlansService,
  recover: inheritanceRecoverPlansService,
  getPlan,
  edit: inheritanceEditPlansService,
};
