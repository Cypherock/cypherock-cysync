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
  AuthTokenConfig,
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
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      createResultSchema,
      `${baseUrl}/info/message`,
      {
        encryptedData: params.encryptedData,
        sessionId: params.sessionId,
      },
      params.authTokenConfig,
    ),
  );

const applyCoupon = async (params: {
  coupon: string;
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      applyCouponResultSchema,
      `${couponBaseUrl}/activate`,
      {
        coupon: params.coupon,
      },
      params.authTokenConfig,
    ),
  );

const checkCoupon = async (params: {
  coupon: string;
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      checkCouponResultSchema,
      `${couponBaseUrl}/check-coupon`,
      {
        coupon: params.coupon,
      },
      params.authTokenConfig,
    ),
  );

const activate = async (params: {
  coupon: string;
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      activateResultSchema,
      `${couponBaseUrl}/activate`,
      {
        coupon: params.coupon,
      },
      params.authTokenConfig,
    ),
  );

const getPlan = async (params: { authTokenConfig: AuthTokenConfig }) =>
  runAndHandleServerErrors(() =>
    makeGetRequest(
      getPlanResultSchema,
      `${baseUrl}/list`,
      params.authTokenConfig,
    ),
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
