import { LoginStep } from '@shared/models';

export const OTP_LENGTH = 6;

export const LOGIN_STEPS = {
  EMAIL: 'email' as LoginStep,
  OTP: 'otp' as LoginStep,
};
