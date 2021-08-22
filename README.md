<h1 align="center" style="color: #61dafb;">Wine</h1>

<br>

<p align="center" style="color:#666">Your next JS validation library</p>

<br>

<!-- TOC -->

- [Features](#features)
- [usage](#usage)
    - [基础](#基础)
    - [异步验证&单值验证](#异步验证单值验证)
    - [name取值示例](#name取值示例)
    - [验证器](#验证器)
    - [嵌套验证](#嵌套验证)
    - [自定义提示模板](#自定义提示模板)
    - [函数参数验证](#函数参数验证)
- [API](#api)
    - [NamePath](#namepath)
    - [Verify](#verify)
    - [Schema](#schema)
    - [Validator](#validator)
    - [Meta](#meta)
    - [RejectMeta](#rejectmeta)
    - [Config](#config)

<!-- /TOC -->

<br>


## Features

- 覆盖多种验证类型, object验证，array验证，复杂嵌套结构验证，异步验证, 函数参数验证。
- 很小的体积。
- 全验证器用法，易学，易组合， 以及更少的概念。
- 完善的验证模板定制能力。
- 很多常用的内置验证器。



<br>

## usage

### 基础

安装依赖

```shell
yarn add @m78/verify
// or
npm install @m78/verify
```



导入并使用

```typescript
import { createVerify, required, string, number } from '@m78/verify';

// 创建一个verify实例，可以创建多个实例，每个实例拥有独立的配置
const verify = createVerify(/* config */);

// 待验证的数据源
const data =  {
    user: 'lxj',
    sex: 1,
};

// 验证schema配置
const schema = [
    {
        name: 'user',
        validator: [required(), string({ min: 4 })],
    },
    {
        name: 'sex',
        validator: [required(), number()],
    },
];

// 执行验证
const rejects = verify.check(data, schema);


// 如果rejects为null， 表示验证通过，验证失败时为一个包含了多个Meta对象的数组, Meta对象的详情见下方Meta部分
[
    {
         message: '...'
    }
]
```



### 异步验证&单值验证

执行异步验证

```typescript
// 待验证的数据源
const data =  {
    user: 'lxj',
};

// 验证schema配置
const schema = [
    {
        name: 'user',
        validator: [
            required(), 
            string({ min: 4 }),
            // 添加异步验证器，通常会放在常规验证器底部, 异步验证器就是同步验证器的Promise版本，详情见API的Validator部分
            async () => {
                await someThing();
            }
        ],
    },
];

verify.asyncCheck(data, schema).then(rejects => {
   // rejects与上一实例中的相同
});
```



单值验证其实就是普通验证的简单包装, 用于对单个值进行便捷验证, rejects处理函数与常规验证相同, 单值验证还有一个异步版本`singleAsyncCheck()`

```
const rejects = verify.singleCheck(123, {
	validator: [require(), number({ max: 100 })],
});
```





### name取值示例

Schema的name支持嵌套取值

```
{
	name: 'key',	// 常规取值, 对应 source.key
	name: '0',		// 数组取值, 对应 source['0']
	name: ['user', 'name'],		// 对象嵌套取值, 对应 source.user.name
	name: ['list', '1', 'title'],		// 数组嵌套取值, 对应 source.list[1].name
	name: ['0', 'title'],		// 数组嵌套取值, 对应 source[1].name
}
```





### 验证器

验证器分为同步验证器和异步验证器

验证器接收Meta对象，它包含了很多关于验证的信息，如果验证器返回了一个string, 则视为验证失败, 下面是一个同步验证器的示例。

```js
function string({ value }) {
	if (typeof value !== 'string') return '必须为字符类型';
    
    // 如果验证器抛出错误，则将错误对象的message作为验证反馈, 通过下面代码可以实现相同的效果
    if (typeof value !== 'string') throw new Error('必须为字符类型');
}
```



异步验证器与同步验证器编写方式几乎一致，除了它返回一个Promise，这个Promise的resolve值与同步验证器的返回值等效

```js
async function asyncCheck({ value }) {
    // 执行一些异步操作
    const val = await fetchSomething();
    
	if (val === value) return '该值已存在';
}
```



更多验证器的细节请见下方Validator部分





### 嵌套验证

支持任意结构和深度的嵌套值验证, schema配置严格子级结构，eachSchema配置所有直接子级应遵循的结构

```typescript
const data = {
    name: 'lxj',
    list: ['1', '2', 3],
    map: {
        field1: '123',
        field2: 123,
    },
    listMap: [
        {
            key: '123',
        },
        {
            key: 123,
        },
    ],
    listList: [['xxx'], ['xxx'], 123, [123]],
};

const schema = [
    {
        name: 'name',
        validator: [required(), string({ length: 4 })],
    },
    // 一个数组，该数组的每一个子级都是string
    {
        name: 'list',
        validator: [required(), array()],
        eachSchema: {
            validator: [required(), string()],
        },
    },
    // 一个对象，该对象的子结构严格限制
    {
        name: 'map',
        validator: [required(), object()],
        schema: [
            {
                name: 'field1',
                validator: [required(), number()],
            },
            {
                name: 'field2',
                validator: [required(), string()],
            },
        ],
    },
    // 一个数组，每一个子级都是一个对象，同时也这个对象的结构进行了现在
    {
        name: 'listMap',
        validator: [required(), array()],
        eachSchema: {
            validator: [object()],
            schema: [
                {
                    name: 'key',
                    validator: [required(), number()],
                },
            ],
        },
    },
    // 一个二位数组，二维数组的子项必须为number
    {
        name: 'listList',
        validator: [required(), array()],
        eachSchema: {
            validator: [array()],
            eachSchema: {
                validator: [number()],
            },
        },
    },
]

verify2.check(data, schema);
```





### 自定义提示模板

内置了中文和英文两种提示模板，在创建实例时通过如下方式配置

```typescript
import { createVerify, simplifiedChinese, english } from '@m78/verify';

const verify = createVerify({
    languagePack: simplifiedChinese;
});
```



可以通过如下方式修改部分配置，模板配置会进行深合并，不会影响其他配置, 你可以任意扩展提示模板，并在自定义验证器中通过meta访问

```typescript
import { createVerify } from '@m78/verify';

const verify = createVerify({
    languagePack: {
        required: 'this is a required field',
        object: 'must be object',
        // 模板支持插值
        number: {
            notExpected: 'Must be a number',
            notInteger: 'Must be a integer',
            max: 'Cannot be greater than {max}',
            min: 'Cannot be less than {min}',
            size: 'Must be {size}',
        },
    };
});
```



如果有任何疑惑，可以参考默认语言模板配置

```json

export const english = {
  required: 'Required',
  object: 'Must be a regular object',
  bool: 'Must be a Boolean value',
  fn: 'Must be function',
  symbol: 'Must be a symbol value',
  regexp: 'Must be a regexp object',
  regexpString: 'Must be a valid regular character',
  url: 'Must be a valid url',
  email: 'Must be a valid email',
  // 额外插值: regexp
  pattern: 'Invalid format',
  // 额外插值: specific
  specific: 'Only be a {specific}',
  // 额外插值: targetLabel
  equality: 'Must be a the same as {targetLabel}',
  // 额外插值: within
  within: 'Must be a member of {within}',
  // 额外插值: without
  without: 'Must be a value other than {without}',
  // 额外插值: max, min, length
  string: {
    notExpected: 'Must be a string',
    max: 'Length cannot be greater than {max}',
    min: 'Length cannot be less than {min}',
    length: 'The length can only be {length}',
  },
  // 额外插值: max, min, length
  array: {
    notExpected: 'Must be a array',
    max: 'No more than {max} items',
    min: 'No less than {min} items',
    length: 'Must be {length} items',
  },
  // 额外插值: max, min, size
  number: {
    notExpected: 'Must be a number',
    notInteger: 'Must be a integer',
    max: 'Cannot be greater than {max}',
    min: 'Cannot be less than {min}',
    size: 'Must be {size}',
  },
  // 除notExpected外的额外插值: max, min, at
  date: {
    notExpected: 'Must be a valid date',
    max: 'Cannot be after {max}',
    min: 'Cannot be before {min}',
    at: 'Must be {at}',
    between: 'Must be between {min} ~ {max}',
  },
};
```



### 函数参数验证

```typescript
function fn(...args) {
    const rejects = verify.check(args, [
        {
            name: '0',
            validator: [required()],
        },
        {
            name: '1',
            validator: [required()],
        },
    ]);

    // 处理rejects
}

fn();
```

另一种方式是使用隐藏的`arguments`参数，不过在某些lint环境中可能会被禁用

```typescript
function fn(name, age) {
    const rejects = verify.check(arguments, [
        {
            name: '0',
            validator: [required()],
        },
        {
            name: '1',
            validator: [required()],
        },
    ]);

    // 处理rejects
}

fn();
```







<br>

## API

### NamePath

```typescript
/**
 * 表示name的字符或字符数组，数组用法用于链式取值，如: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 * */
export type NamePath = string | string[];
```





### Verify

验证器实例

```typescript
interface Verify {
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
```



### Schema

表示模式配置中的一项

```typescript
interface Schema {
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
```



### Validator

```typescript
/**
 * 验证器，验证器有三种类型的返回值:
 * - 1.返回string, 表示包含错误并将其作为错误反馈文本返回
 * - 2.接收Meta并返回string的函数，返回的string与上一条中的作用一样, 此用法通常用于搭配languagePack，一般不会使用
 * - 3.一个包含错误模板和插值的ErrorTemplateInterpolate对象，用于实现模板插值，在扩展了languagePack并需要为自定义验证器添加插值时使用
 *
 * 另外，如果验证器内部发生了异常，该异常会被捕获，并使用Error.message来作为错误反馈文本
 * */
export interface Validator {
  (meta: Meta): void | ErrorTemplateType | ErrorTemplateInterpolate;
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
}
```



### Meta

一个描述验证信息的对象

```typescript
interface Meta {
  /** 当前verify实例 */
  verify: Verify;
  /** Schema.name的字符化 */
  name: string;
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

  /** 其他任意扩展字段 */
  [key: string]: any;
}
```



### RejectMeta

描述验证失败信息的对象, 除了新增了一个message字段外与Meta完全相同

```typescript
interface RejectMetaItem extends Meta {
  /** 验证失败的提示 */
  message: string;
}
```



### Config

共有两种配置, 一是创建verify时的配置，二是执行验证检测的配置

```typescript
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
}

/** 验证时传入的配置 */
export interface CheckConfig {
  /** 此对象会合并到 Meta 中，如果与内置key同名则覆盖内置key */
  extraMeta: AnyObject;
}
```



