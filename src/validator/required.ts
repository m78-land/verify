import { Meta, Validator } from '@m78/verify';
import { isEmpty } from '@lxjx/utils';

export const requiredValidatorKey = 'verifyRequired';

/**
 * 是否是verify认可的空值 undefined, null ,'', NaN, [], {}, 空白字符
 * */
export const isVerifyEmpty = (value: any) => {
  if (isEmpty(value) && value !== 0 && value !== false) return true;
  return typeof value === 'string' && value.trim() === '';
};

/**
 * 必需项，值不能为 undefined, null ,'', NaN, [], {}, 空白字符中的任意一项
 * */
export const required = () => {
  const requiredValidator: Validator = ({ value, config }: Meta) => {
    const msg = config.languagePack.required;

    if (isVerifyEmpty(value)) return msg;
  };

  requiredValidator.key = requiredValidatorKey;

  return requiredValidator;
};
