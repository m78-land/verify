import { Meta } from '@m78/verify';
import { isEmpty } from '@lxjx/utils';

export const requiredValidatorKey = 'verifyRequired';

/**
 * 必需项，值不能为 undefined, null ,'', NaN, [], {}, 空白字符中的任意一项
 * */
export const required = () => {
  function requiredValidator({ value, config }: Meta) {
    const msg = config.languagePack.required;

    if (isEmpty(value) && value !== 0 && value !== false) return msg;

    // 空白字符字符
    if (typeof value === 'string' && value.trim() === '') return msg;
  }

  requiredValidator.key = requiredValidatorKey;

  return requiredValidator;
};
