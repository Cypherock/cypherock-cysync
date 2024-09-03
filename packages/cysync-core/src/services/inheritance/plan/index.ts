import { config } from '~/config';

import {
  activateResultSchema,
  applyCouponResultSchema,
  createResultSchema,
} from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../../utils';

export {
  type InheritancePlanCreateResponse,
  type InheritancePlanActivateResponse,
  type InheritancePlanApplyCouponResponse,
} from './schema';

const baseUrl = `${config.API_CYPHEROCK}/wallet-account`;
const couponBaseUrl = `${config.API_CYPHEROCK}/wallet-recovery`;

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
};
