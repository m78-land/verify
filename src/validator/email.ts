import { Meta, Validator } from '@m78/verify';
import { isVerifyEmpty } from './required';

function isEmail(email: string) {
  return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
    email,
  );
}

export const emailValidatorKey = 'verifyEmail';

/**
 * 是否为有效email
 * */
export const email = () => {
  const emailValidator: Validator = ({ value, config }: Meta) => {
    if (isVerifyEmpty(value)) return;
    if (!isEmail(value)) return config.languagePack.email;
  };

  emailValidator.key = emailValidatorKey;

  return emailValidator;
};
