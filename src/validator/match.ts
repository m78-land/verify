import { Meta, string } from '@m78/verify';
import { isVerifyEmpty } from './required';

export const matchValidatorKey = 'verifyMatch';

/**
 * 将字符串值与给的字符串或正则匹配, 如果字符串值包含给定的字符或正则模式则视为通过
 * */
export function match(keyword: string | RegExp) {
  function matchValidator(meta: Meta) {
    const tpl = meta.config.languagePack.match;

    if (isVerifyEmpty(meta.value)) return;

    const e = string()(meta);

    if (e) return e;

    const reg = new RegExp(keyword);

    if (!reg.test(meta.value)) {
      return {
        errorTemplate: tpl,
        interpolateValues: {
          keyword,
        },
      };
    }
  }

  matchValidator.key = matchValidatorKey;

  return matchValidator;
}
