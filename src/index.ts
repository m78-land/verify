import _defaultsDeep from 'lodash/defaultsDeep';
import { Config, Verify } from './types';
import { defaultConfig } from './default-config';
import { getCheckApi } from './check';
import { simplifiedChinese, english } from './language-pack';

import { required } from './validator/required';
import { object } from './validator/object';
import { bool } from './validator/bool';
import { string } from './validator/string';
import { array } from './validator/array';
import { fn } from './validator/fn';
import { number } from './validator/number';
import { symbol } from './validator/symbol';
import { regexp } from './validator/regexp';
import { regexpString } from './validator/regexp-string';
import { pattern } from './validator/pattern';
import { specific } from './validator/specific';
import { equality } from './validator/equality';
import { within } from './validator/within';
import { without } from './validator/without';
import { url } from './validator/url';
import { email } from './validator/email';
import { date } from './validator/date';

function createVerify(config?: Config): Verify {
  const conf = _defaultsDeep(config, defaultConfig) as Required<Config>;

  const verify: Verify = {
    languagePack: conf.languagePack,
  } as Verify;

  return Object.assign(verify, getCheckApi(conf, verify));
}

export * from './types';
export {
  createVerify,
  simplifiedChinese,
  english,
  required,
  object,
  bool,
  string,
  array,
  fn,
  number,
  symbol,
  regexp,
  regexpString,
  pattern,
  specific,
  equality,
  within,
  without,
  url,
  email,
  date,
};
