import { Meta } from '@m78/verify';

/**
 * 是否为指定的值, 只能是通过Object.is对比的常规值
 * */
export const specific = (val: any) => ({ value, config }: Meta) => {
  if (val !== value)
    return {
      errorTemplate: config.languagePack.specific,
      interpolateValues: {
        specific: val,
      },
    };
};
