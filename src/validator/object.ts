import { isObject } from '@lxjx/utils';
import { Meta, Validator } from '@m78/verify';
import { isVerifyEmpty } from './required';

export const objectValidatorKey = 'verifyObject';

/**
 * 必须是严格的对象类型 [Object objcet], 如果是[Object regexp]等特殊内置对象则不会通过检测
 * */
export const object = () => {
  const objectValidator: Validator = ({ value, config }: Meta) => {
    if (isVerifyEmpty(value)) return;
    if (!isObject(value)) return config.languagePack.object;
  };

  objectValidator.key = objectValidatorKey;

  return objectValidator;
};
