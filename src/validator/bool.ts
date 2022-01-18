import { isBoolean } from '@lxjx/utils';
import { Meta } from '@m78/verify';
import { isVerifyEmpty } from './required';

export const boolValidatorKey = 'verifyBool';

/**
 * 是否为boolean值
 * */
export const bool = () => {
  function boolValidator({ value, config }: Meta) {
    if (isVerifyEmpty(value)) return;
    if (!isBoolean(value)) return config.languagePack.bool;
  }

  boolValidator.key = boolValidatorKey;

  return boolValidator;
};
