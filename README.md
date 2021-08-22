<h1 align="center" style="color: #61dafb;">Verify</h1>

<br>

<p align="center" style="color:#666">Your next JS validation library</p>

<br>

<p align="center">
    <span>en</span> | 
    <a href="./README.zh-cn.md">中文</a>
</p>

<br>

<!-- TOC -->

- [.1. Features](#1-features)
- [.2. usage](#2-usage)
    - [.2.1. Basic](#21-basic)
    - [.2.2. Asynchronous verification & single verification](#22-asynchronous-verification--single-verification)
    - [.2.3. Name Example](#23-name-example)
    - [.2.4. Validator](#24-validator)
    - [.2.5. Nested validation](#25-nested-validation)
    - [.2.6. Customize prompt template](#26-customize-prompt-template)
    - [.2.7. Function parameter validation](#27-function-parameter-validation)
- [.2. API](#2-api)
    - [.2.1. NamePath](#21-namepath)
    - [.2.2. Verify](#22-verify)
    - [.2.3. Schema](#23-schema)
    - [.2.4. Validator](#24-validator)
    - [.2.5. Meta](#25-meta)
    - [.2.6. RejectMeta](#26-rejectmeta)
    - [.2.7. Config](#27-config)

<!-- /TOC -->

<br>


## .1. Features

- Covers multiple validation types, object validation, array validation, complex nested structure validation, asynchronous validation, function parameter validation.

- Small volume.

- Full validators use methods, easy to learn, easy to combine, and fewer concepts.

- Perfect verification template customization capability.

- Many commonly used built-in validators.



<br>

## .2. usage

### .2.1. Basic

Install dependencies

```shell
yarn add @m78/verify
// or
npm install @m78/verify
```



Import and use

```typescript
import { createVerify, required, string, number } from '@m78/verify';

// Create one instance of Verify. You can create multiple instances, each with its own configuration
const verify = createVerify(/* config */);

// Data source to be verified
const data =  {
    user: 'lxj',
    sex: 1,
};

// schema configuration
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

// verification
const rejects = verify.check(data, schema);


// If rejects is null, it means the verification is passed. When the verification fails, it is an array containing multiple Meta objects. For details of Meta objects, see the Meta section below
[
    {
         message: '...'
    }
]
```



### .2.2. Asynchronous verification & single verification

Perform asynchronous verification

```typescript
// Data source to be verified
const data =  {
    user: 'lxj',
};

// schema configuration
const schema = [
    {
        name: 'user',
        validator: [
            required(), 
            string({ min: 4 }),
            // Add an asynchronous validator, usually at the bottom of the regular validator. The asynchronous validator is the Promise version of the synchronous validator. For details, see the Validator section of the API
            async () => {
                await someThing();
            }
        ],
    },
];

verify.asyncCheck(data, schema).then(rejects => {
   // rejects are the same as in the previous example
});
```



Single-value verification is actually a simple package of ordinary verification, which is used to conveniently verify a single value. The rejects processing function is the same as regular verification. There is also an asynchronous version of single-value verification `singleAsyncCheck()`

```
const rejects = verify.singleCheck(123, {
	validator: [require(), number({ max: 100 })],
});
```



### .2.3. Name Example

Schema name supports nested values

```
{
	name: 'key',	// Normal value, corresponding to source.key
	name: '0',		// Array value, corresponding source['0']
	name: ['user', 'name'],		// Object nested value, corresponding source.user.name
	name: ['list', '1', 'title'],		// Array nested value, corresponding source.list[1].name
	name: ['0', 'title'],		// Array nested value, corresponding source[1].name
}
```





### .2.4. Validator

Validators are divided into synchronous validators and asynchronous validators

validator receives a Meta object, which contains a lot of information about the validation. If the validator returns a string, the validation is considered to have failed. Here is an example of a synchronous validator.

```js
function string({ value }) {
	if (typeof value !== 'string') return 'Must be a string type';
    
    // If the validator throws an error, the message of the error object is used as validation feedback. The following code achieves the same effect
    if (typeof value !== 'string') throw new Error('Must be a string type');
}
```



The asynchronous validator is written in almost the same way as the synchronous validator, except that it returns a Promise whose resolve value is equivalent to that returned by the synchronous validator

```js
async function asyncCheck({ value }) {
    // Perform some asynchronous operations
    const val = await fetchSomething();
    
	if (val === value) return 'The value already exists';
}
```



See the Validator section below for more details on validators





### .2.5. Nested validation

Support for arbitrary structure and depth of nested value validation, schema configuration strict substructure, eachSchema configuration all direct children should follow the structure

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
    // An array in which each child is a String
    {
        name: 'list',
        validator: [required(), array()],
        eachSchema: {
            validator: [required(), string()],
        },
    },
    // An object whose substructures are strictly limited
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
    // An array where each child is an object and the structure of the object is present
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
    // A two-bit array. The children of the two-dimensional array must be number
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





### .2.6. Customize prompt template

Chinese and English prompt templates are built-in, which can be configured as follows when creating an instance

```typescript
import { createVerify, simplifiedChinese, english } from '@m78/verify';

const verify = createVerify({
    languagePack: simplifiedChinese;
});
```



Some configurations can be modified in the following ways, template configurations are deeply merged and do not affect other configurations, and you can extend the prompt template at will and access it through meta in the custom validator

```typescript
import { createVerify } from '@m78/verify';

const verify = createVerify({
    languagePack: {
        required: 'this is a required field',
        object: 'must be object',
        // Templates support interpolation
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



If in doubt, refer to the default language template configuration

```js
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
  // extra: regexp
  pattern: 'Invalid format',
  // extra: specific
  specific: 'Only be a {specific}',
  // extra: targetLabel
  equality: 'Must be a the same as {targetLabel}',
  // extra: within
  within: 'Must be a member of {within}',
  // extra: without
  without: 'Must be a value other than {without}',
  // extra: max, min, length
  string: {
    notExpected: 'Must be a string',
    max: 'Length cannot be greater than {max}',
    min: 'Length cannot be less than {min}',
    length: 'The length can only be {length}',
  },
  // extra: max, min, length
  array: {
    notExpected: 'Must be a array',
    max: 'No more than {max} items',
    min: 'No less than {min} items',
    length: 'Must be {length} items',
  },
  // extra: max, min, size
  number: {
    notExpected: 'Must be a number',
    notInteger: 'Must be a integer',
    max: 'Cannot be greater than {max}',
    min: 'Cannot be less than {min}',
    size: 'Must be {size}',
  },
  // extra: max, min, at
  date: {
    notExpected: 'Must be a valid date',
    max: 'Cannot be after {max}',
    min: 'Cannot be before {min}',
    at: 'Must be {at}',
    between: 'Must be between {min} ~ {max}',
  },
};
```



### .2.7. Function parameter validation

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

    // handle rejects
}

fn();
```

An alternative is to use the hidden 'arguments' argument, though this may be disabled in some Lint environments

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

## .2. API

### .2.1. NamePath

```typescript
/**
 * Represents the character or character array of the name, and the array usage is used for chained value, such as: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 * */
export type NamePath = string | string[];
```





### .2.2. Verify

验证器实例

```typescript
interface Verify {
  /** Perform synchronous validation */
  check: (source: any, schemas: Schema[], config?: CheckConfig) => RejectMeta | null;
  /**
   * Perform asynchronous validation
   * - The use of synchronous validators is also supported in asynchronous validation
   * */
  asyncCheck: (source: any, schemas: Schema[], config?: CheckConfig) => Promise<RejectMeta | null>;
  /** Use a single schema to validate a single value */
  singleCheck: (
    source: any,
    schema: Omit<Schema, 'name'>,
    config?: CheckConfig,
  ) => RejectMeta | null;
  /** Asynchronous validation of a single value using a single Schema */
  singleAsyncCheck: (
    source: any,
    schema: Omit<Schema, 'name'>,
    config?: CheckConfig,
  ) => Promise<RejectMeta | null>;
  /** The languagePack currently in use */
  readonly languagePack: AnyObject;
}
```



### .2.3. Schema

Represents an entry in the pattern configuration

```typescript
interface Schema {
  /** The key used to get the value in the source */
  name: NamePath;
  /** Used to validate the name of the displayed field. When not passed, the name is converted to a string value */
  label?: string;
  /**
   * A validator or array of validators
   * - An exception from the previous validator stops subsequent validators
   * - The order in which validators are executed is related to the order in the array, so the higher-priority validators should be placed first, such as [required(), dateTime()]
   * - In the case of asynchronous validation, the asynchronous validator should always come first
   * */
  validator?: Validator | AsyncValidator | (Validator | AsyncValidator)[];
  /** If the object is a nested structure (array, object) and the nested validation is performed on it, the child's name is automatically preceded by the name of all its parents*/
  schema?: Schema[];
  /** If the validation value is array or Object, all array entries/object values must match the Schema. If the value's type is not Array or Object, this configuration is ignored */
  eachSchema?: Omit<Schema, 'name'>;
  /** The value is converted before it is manipulated and validated. For values of reference types, the object should be copied for conversion to prevent damage to the original object */
  transform?: (value: any) => any;
}
```



### .2.4. Validator

```typescript
/**
 * Validators, validators have three types of return values:
 * - 1.Mandatory string that contains an error and is returned as error feedback text
 * - 2.A function that receives Meta and returns string, as in the previous one. This is usually used with an languagePack, but is not usually used
 * - 3.An ErrorTemplateInterpolate object containing the error template and interpolation, used to implement template interpolation when extending the languagePack and interpolating is required for custom validators
 *
 * In addition, if an exception occurs inside the validator, the exception will be caught and Error. Message will be used as the Error feedback text
 * */
export interface Validator {
  (meta: Meta): void | ErrorTemplateType | ErrorTemplateInterpolate;
}

/**
 * AsyncValidators, validators have three types of resolve values:
 * - 1.String, which contains the error and returns it as error feedback text
 * - 2.A function that receives Meta and returns string, as in the previous one. This is usually used with an languagePack, but is not usually used
 * - 3.An ErrorTemplateInterpolate object containing the error template and interpolation, used to implement template interpolation when extending the languagePack and interpolating is required for custom validators
 *
 * In addition, if an exception occurs inside the validator, the exception will be caught and Error. Message will be used as the Error feedback text
 * */
export interface AsyncValidator {
  (meta: Meta): Promise<void | ErrorTemplateType | ErrorTemplateInterpolate>;
}
```



### .2.5. Meta

An object that describes the validation information

```typescript
interface Meta {
  /** current verify instance */
  verify: Verify;
  /** Schema.name string */
  name: string;
  /** The value corresponds to schema. label, which is the same as name before being passed. This value should always be used to display field names */
  label: string;
  /** The value to be verified */
  value: any;
  /** All values, corresponding to the source passed in during validation */
  values: any;
  /** current Schema */
  schema: Schema;
  /** All Schema, Corresponds to the schema passed in during validation */
  schemas: Schema[];
  /** Get its value by name */
  getValueByName: (name: NamePath) => any;
  /** create config */
  config: Required<Config>;

  /** other expand */
  [key: string]: any;
}
```



### .2.6. RejectMeta

The object that describes the validation failure information is identical to the Meta except for the addition of a message field

```typescript
interface RejectMetaItem extends Meta {
  /** An authentication failure message is displayed */
  message: string;
}
```



### .2.7. Config

There are two configurations: the configuration for creating Verify and the configuration for performing verification checks

```typescript
/** verify create configuration */
export interface Config {
  /** true | When the validation of one of the fields fails, the validation of subsequent fields is stopped */
  verifyFirst?: boolean;
  /**
   * Error templates can be characters or functions that receive characters returned by Meta. The incoming object is deeply merged with the current object, so if only part of the error template is changed, other templates will not be affected
   * - The template string is injected with the following variables and interpolated with {name}. If the interpolation syntax conflicts with the original character, use \\{name} to avoid interpolation
   *    - name:  Schema.name
   *    - label: The value corresponds to schema. label, which is the same as name before being passed. This value should always be used to display field names
   *    - value: Field value, which should be used only when validating the value as the underlying type
   *    - valueType: A string representation of type value
   * - Additional interpolation is injected into a particular validator, as you can see in the corresponding validator's documentation
   * */
  languagePack?: AnyObject;
}

/** The configuration passed in during validation */
export interface CheckConfig {
  /** This object is merged into the Meta and overrides the built-in key if it has the same name */
  extraMeta: AnyObject;
}
```

