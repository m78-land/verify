import { AnyFunction, AnyObject, isArray, isFunction, isObject, isString } from '@lxjx/utils';
import {
  Config,
  ErrorTemplateType,
  Meta,
  NamePath,
  RejectMeta,
  Schema,
  Validator,
  Verify,
} from './types';
import {
  ensureArray,
  fmtValidator,
  getValue,
  interpolate,
  isErrorTemplateInterpolate,
  stringifyNamePath,
} from './common';

/**
 * 获取check api，verify此时还不可操作, 仅可作为引用传递
 * - 这里要注意的点是，同步和异步 check流程极为相似，为了最大程度的复用，在同步验证时这里通过syncCallBack来对检测结果进行同步回调
 * */
export function getCheckApi(conf: Required<Config>, verify: Verify) {
  const baseCheck = async (args: Parameters<Verify['asyncCheck']>, syncCallback?: AnyFunction) => {
    // 传入callback视为同步调用
    const isSync = !!syncCallback;

    const [source, schemas, _config] = args;

    const rejectMeta: RejectMeta = [];

    const getValueByName: Meta['getValueByName'] = name => getValue(source, name);

    // 对一项schema执行检测, 返回true时可按需跳过后续schema的验证
    // 如果传入parentNames，会将当前项作为指向并将parentNames与当前name拼接
    // 同步调用时需要使用checkItemSyncCallback通知跳过验证
    async function checkSchema(
      schema: Schema,
      parentNames: NamePath,
      checkItemSyncCallback?: AnyFunction,
    ) {
      const validators = fmtValidator(schema.validator);

      const namePath = [...ensureArray(parentNames), ...ensureArray(schema.name)];

      const name = stringifyNamePath(namePath);
      const label = schema.label || name;
      let value = getValueByName(namePath);

      // 预转换值
      if (schema.transform) value = schema.transform(value);

      // 插值对象
      const interpolateValues: AnyObject = {
        name,
        label,
        value,
        type: Object.prototype.toString.call(value),
      };

      // 验证validators
      if (validators?.length) {
        for (const validator of validators) {
          let errorTemplate: ErrorTemplateType = '';

          const meta: Meta = {
            verify,
            name,
            label,
            value,
            values: source,
            schema,
            schemas,
            getValueByName,
            config: conf,
            ..._config?.extraMeta /* 扩展接口 */,
          };

          try {
            const result = isSync ? (validator as Validator)(meta) : await validator(meta);

            // 不同的验证返回类型处理
            if (isString(result)) errorTemplate = result;

            if (isErrorTemplateInterpolate(result)) {
              errorTemplate = result.errorTemplate;
              Object.assign(interpolateValues, result.interpolateValues);
            }

            if (isFunction(result)) errorTemplate = result(meta);
          } catch (err) {
            if (err.message) errorTemplate = err.message;
          }

          if (isString(errorTemplate) && !!errorTemplate.trim()) {
            rejectMeta.push({
              ...meta,
              message: interpolate(errorTemplate, interpolateValues),
            });

            break;
          }
        }
      }

      if (schema.schema?.length) {
        if (isSync) {
          checkSchemas(schema.schema, namePath).then();
        } else {
          await checkSchemas(schema.schema, namePath);
        }
      }

      if (schema.eachSchema) {
        let _schemas: Schema[] = [];

        if (isArray(value)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _schemas = value.map((_, index) => ({
            ...schema.eachSchema,
            name: String(index),
          }));
        }

        if (isObject(value)) {
          _schemas = Object.entries(value).map(([key]) => ({
            ...schema.eachSchema,
            name: key,
          }));
        }

        if (isSync) {
          checkSchemas(_schemas, namePath).then();
        } else {
          await checkSchemas(_schemas, namePath);
        }
      }

      const needBreak = !!(conf.verifyFirst && rejectMeta.length);

      if (isSync) {
        checkItemSyncCallback?.(needBreak);
      } else {
        return needBreak;
      }
    }

    // 检测一组schema
    async function checkSchemas(_schemas: Schema[], parentNames: NamePath) {
      for (const schema of _schemas) {
        if (isSync) {
          let needBreak;
          checkSchema(schema, parentNames, nb => (needBreak = nb)).then();

          if (needBreak) break;
        } else {
          const needBreak = await checkSchema(schema, parentNames);
          if (needBreak) break;
        }
      }
    }

    if (isSync) {
      checkSchemas(schemas, []).then();
    } else {
      await checkSchemas(schemas, []);
    }

    const _rejectMeta = rejectMeta.length ? rejectMeta : null;

    if (isSync) {
      syncCallback?.(_rejectMeta);
      return null;
    }

    return _rejectMeta;
  };

  const check: Verify['check'] = (...args) => {
    let rejectMeta: RejectMeta | null = null;
    baseCheck(args, _rejectMeta => (rejectMeta = _rejectMeta)).then();
    return rejectMeta;
  };

  const asyncCheck: Verify['asyncCheck'] = async (...args) => baseCheck(args);

  const singleCheck: Verify['singleCheck'] = (source, schema, config) => {
    return check(
      [source],
      [
        {
          ...schema,
          name: '0',
        },
      ],
      config,
    );
  };

  const singleAsyncCheck: Verify['singleAsyncCheck'] = async (source, schema, config) => {
    return asyncCheck(
      [source],
      [
        {
          ...schema,
          name: '0',
        },
      ],
      config,
    );
  };

  return {
    check,
    asyncCheck,
    singleCheck,
    singleAsyncCheck,
  };
}
