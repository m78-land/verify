import { isFunction } from '@lxjx/utils';
import { isVerifyEmpty, Meta } from '@m78/verify';

export const fnValidatorKey = 'verifyFn';

/**
 * 是否为function
 * */
export const fn = () => {
  function fnValidator({ value, config }: Meta) {
    if (isVerifyEmpty(value)) return;
    if (!isFunction(value)) return config.languagePack.fn;
  }

  fnValidator.key = fnValidatorKey;

  return fnValidator;
};
