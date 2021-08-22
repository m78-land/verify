import { isRegExp, isString } from '@lxjx/utils';
import { Meta } from '@m78/verify';

/**
 * 必须通过指定的正则校验, regexp可以时正则字符或正则对象
 * */
export const pattern = (regexp: string | RegExp, tpl?: string) => ({ value, config }: Meta) => {
  let reg = regexp;

  if (isString(reg)) {
    reg = new RegExp(reg);
  }

  if (!isRegExp(reg)) return;

  if (!(reg as RegExp).test(value)) {
    return {
      errorTemplate: tpl || config.languagePack.pattern,
      interpolateValues: {
        regexp: reg.toString(),
      },
    };
  }
};
