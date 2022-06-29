import { isFunction } from '@lxjx/utils';
import { Meta, Validator } from '@m78/verify';
import { isVerifyEmpty } from './required';

export const fnValidatorKey = 'verifyFn';

/**
 * 是否为function
 * */
export const fn = () => {
  const fnValidator: Validator = ({ value, config }: Meta) => {
    if (isVerifyEmpty(value)) return;
    if (!isFunction(value)) return config.languagePack.fn;
  };

  fnValidator.key = fnValidatorKey;

  return fnValidator;
};
