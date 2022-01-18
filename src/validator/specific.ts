import { isVerifyEmpty, Meta } from '@m78/verify';

export const specificValidatorKey = 'verifySpecific';

/**
 * 是否为指定的值, 只能是通过Object.is对比的常规值
 * */
export const specific = (val: any) => {
  function specificValidator({ value, config }: Meta) {
    if (isVerifyEmpty(value)) return;
    if (val !== value)
      return {
        errorTemplate: config.languagePack.specific,
        interpolateValues: {
          specific: val,
        },
      };
  }

  specificValidator.key = specificValidatorKey;

  return specificValidator;
};
