import type { AnyObject, NamePath } from '@lxjx/utils';

/** 错误模板值允许的类型 */
export type ErrorTemplateType = string | ((meta: Meta) => string);

/** 错误模板插值对象 */
export interface ErrorTemplateInterpolate {
  /** 模板对象 */
  errorTemplate: ErrorTemplateType;
  /** 要插入模板中的值对象 */
  interpolateValues: AnyObject;
}

/**
 * 验证器，验证器有三种类型的返回值:
 * - 1.返回string, 表示包含错误并将其作为错误反馈文本返回
 * - 2.接收Meta并返回string的函数，返回的string与上一条中的作用一样, 此用法通常用于搭配languagePack，一般不会使用
 * - 3.一个包含错误模板和插值的ErrorTemplateInterpolate对象，用于实现模板插值，在扩展了languagePack并需要为自定义验证器添加插值时使用
 *
 * 另外, 如果验证器内部发生了异常，该异常会被捕获，并使用Error.message来作为错误反馈文本
 * 考虑到通用性, 验证器验的空值校验应交给其前置的空校验器完成, 比如 [required(), string()] 中, string不应该具有空校验能力
 * */
export interface Validator {
  (meta: Meta): void | ErrorTemplateType | ErrorTemplateInterpolate;

  /** 可选的验证器标识, 用来帮助判断 */
  key?: string;
}

/**
 * 异步验证器，验证器返回一个Promise, Promise有三种支持的resolve类型:
 * - 1.string, 表示包含错误并将其作为错误反馈文本返回
 * - 2.接收Meta并返回string的函数，返回的string与上一条中的作用一样, 此用法通常用于搭配languagePack，一般不会使用
 * - 3.一个包含错误模板和插值的ErrorTemplateInterpolate对象，用于实现模板插值，在扩展了languagePack并需要为自定义验证器添加插值时使用
 *
 * 另外，如果验证器内部发生了异常，该异常会被捕获，并使用Error.message来作为错误反馈文本
 * */
export interface AsyncValidator {
  (meta: Meta): Promise<void | ErrorTemplateType | ErrorTemplateInterpolate>;

  /** 可选的验证器标识 */
  key?: string;
}

/** verify创建配置 */
export interface Config {
  /** true | 当其中一项验证失败后，停止后续字段的验证 */
  verifyFirst?: boolean;
  /**
   * 语言包配置，错误模板可以是字符，也可以是接收Meta返回字符的函数, 传入对象会与当前对象深合并，所以如果只更改了部分错误模板，不会影响到其他模板
   * - 模板字符串会被注入以下变量, 通过{name}进行插值，如果插值语法和原有字符冲突，使用\\{name}来避免插值
   *    - name:  Schema.name
   *    - label: 对应Schema.label, 未传时与 name相同，用于展示字段名时应始终使用此值
   *    - value: 字段值, 应只在验证值为基础类型时使用
   *    - valueType: value类型的字符串表示
   * - 在特定的验证器中还会注入额外的插值，具体可以查看对应验证器的文档
   * */
  languagePack?: AnyObject;
  /** 不需要定制语言包, 仅需要对其扩展或覆盖时使用此项, 会与默认语言包进行深合并 */
  extendLanguagePack?: AnyObject;
}

/** 验证时传入的配置 */
export interface CheckConfig {
  /** 此对象会合并到 Meta 中，如果与内置key同名则覆盖内置key */
  extraMeta: AnyObject;
}

/**
 * 一个描述数据格式的模式对象
 * */
export interface Schema {
  /** 用来在source中取值的key */
  name: NamePath;
  /** 用于验证显示的字段名, 不传时取name转换为string的值 */
  label?: string;
  /**
   * 验证器或验证器数组
   * - 前一个验证器执行异常时会停止后续验证器执行
   * - 验证器的执行顺序与数组中的顺序有关，所以应将优先级更高的验证器放在前面，如 [required(), dateTime()]
   * - 如果是异步验证，异步验证器应始终放在前面
   * */
  validator?: Validator | AsyncValidator | (Validator | AsyncValidator)[];
  /** 如果对象为嵌套结构(数组、对象)，对其执行嵌套验证, 子项的name前会自动添加其所有父级的name */
  schema?: Schema[];
  /** 验证值为array或object时, 所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: Omit<Schema, 'name'>;
  /** 在对值进行操作、验证前将其转换, 对于引用类型的值，应拷贝对象进行转换以防止对原对象造成破坏 */
  transform?: (value: any) => any;
}

/** 在api内部被共享的对象 */
export interface Meta {
  /** 当前verify实例 */
  verify: Verify;
  /** Schema.name的字符化 */
  name: string;
  /** 当前项name */
  namePath: NamePath;
  /** 对应Schema.label, 未传时与 name相同，用于展示字段名时应始终使用此值 */
  label: string;
  /** 被验证的值 */
  value: any;
  /** 所有值，对应验证时传入的source */
  values: any;
  /** 参与验证的Schema */
  schema: Schema;
  /** 所有Schema, 对应验证时传入的schema */
  schemas: Schema[];
  /** 根据name获取其value */
  getValueByName: (name: NamePath) => any;
  /** 创建配置 */
  config: Required<Config>;
  /** 如果在嵌套结构中, 此项为其父级的name */
  parentNamePath?: NamePath;

  /** 其他任意扩展字段 */
  [key: string]: any;
}

/** 验证失败时的反馈对象 */
export interface RejectMetaItem extends Meta {
  /** 验证失败的提示 */
  message: string;
}

export type RejectMeta = RejectMetaItem[];

/** Verify instance */
export interface Verify {
  /** 执行同步验证 */
  check: (source: any, schemas: Schema[], config?: CheckConfig) => RejectMeta | null;
  /**
   * 执行异步验证
   * - 异步验证中也支持使用同步验证器
   * */
  asyncCheck: (source: any, schemas: Schema[], config?: CheckConfig) => Promise<RejectMeta | null>;
  /** 使用单个schema对单个值进行验证 */
  singleCheck: (
    source: any,
    schema: Omit<Schema, 'name'>,
    config?: CheckConfig,
  ) => RejectMeta | null;
  /** 使用单个schema对单个值进行异步验证 */
  singleAsyncCheck: (
    source: any,
    schema: Omit<Schema, 'name'>,
    config?: CheckConfig,
  ) => Promise<RejectMeta | null>;
  /** 当前使用的languagePack */
  readonly languagePack: AnyObject;
}

export { NamePath };
