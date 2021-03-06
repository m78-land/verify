import { isNumber, isString } from '@lxjx/utils';
import { Meta, Validator } from '@m78/verify';
import { isVerifyEmpty } from './required';

interface Opt {
  max?: number;
  min?: number;
  length?: number;
}

export const stringValidatorKey = 'verifyString';

/**
 * string验证器
 * */
export const string = (option?: Opt) => {
  const stringValidator: Validator = ({ value, config }: Meta) => {
    if (isVerifyEmpty(value)) return;

    const pack = config.languagePack.string;
    if (!isString(value))
      return {
        errorTemplate: pack.notExpected,
        interpolateValues: option || {},
      };

    if (!option) return;

    if (isNumber(option.length) && value.length !== option.length)
      return {
        errorTemplate: pack.length,
        interpolateValues: option!,
      };

    if (isNumber(option.max) && value.length > option.max)
      return {
        errorTemplate: pack.max,
        interpolateValues: option!,
      };

    if (isNumber(option.min) && value.length < option.min)
      return {
        errorTemplate: pack.min,
        interpolateValues: option!,
      };
  };

  stringValidator.key = stringValidatorKey;

  return stringValidator;
};
