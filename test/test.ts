import { array, createVerify, number, object, required, string } from '../src';

const verify = createVerify();

describe('base', () => {
  test('api', () => {
    expect(verify).toStrictEqual({
      check: expect.any(Function),
      asyncCheck: expect.any(Function),
      singleCheck: expect.any(Function),
      singleAsyncCheck: expect.any(Function),
      languagePack: expect.any(Object),
    });
  });

  test('check', () => {
    const reject = verify.check(
      {
        user: 'lxj',
        sex: undefined,
      },
      [
        {
          name: 'user',
          validator: [required()],
        },
        {
          name: 'sex',
          validator: [required()],
        },
      ],
    );

    expect(reject).not.toBeNull();
    expect(reject?.length).toBe(1);
    expect(reject?.[0]?.name).toBe('sex');
    expect(typeof reject?.[0]?.message).toBe('string');

    expect(
      verify.check(
        {
          user: 'lxj',
        },
        [
          {
            name: 'user',
            validator: [required()],
          },
        ],
      ),
    ).toBeNull();
  });

  test('asyncCheck', () => {
    return verify
      .asyncCheck(
        {
          user: '',
          sex: 1,
        },
        [
          {
            name: 'user',
            validator: [required()],
          },
          {
            name: 'sex',
            validator: [required()],
          },
        ],
      )
      .then(reject => {
        expect(reject).not.toBeNull();
        expect(reject?.length).toBe(1);
        expect(reject?.[0]?.name).toBe('user');
      });
  });

  test('meta', () => {
    const reject = verify.check(
      {
        user: 'lxj',
      },
      [
        {
          name: 'user',
          validator: [() => 'reject'],
        },
      ],
      {
        extraMeta: {
          extraProps: 1,
        },
      },
    );

    expect(reject?.[0]).toMatchObject({
      verify: expect.any(Object),
      name: 'user',
      label: 'user',
      value: 'lxj',
      values: {
        user: 'lxj',
      },
      schema: {
        name: 'user',
        validator: [expect.any(Function)],
      },
      schemas: [
        {
          name: 'user',
          validator: [expect.any(Function)],
        },
      ],
      getValueByName: expect.any(Function),
      config: {
        verifyFirst: expect.any(Boolean),
        languagePack: expect.any(Object),
      },
      extraProps: 1,
    });
  });

  test('schema & config', () => {
    const verify2 = createVerify({
      verifyFirst: false,
      languagePack: {
        required: 'not be null',
      },
    });

    const reject = verify2.check(
      {
        user: 'lxj',
        sex: '1',
      },
      [
        {
          name: 'user',
          label: '用户',
          validator: string({
            length: 2,
          }),
        },
        {
          name: 'nonExists',
          validator: required(),
        },
        {
          name: 'sex',
          label: '性别',
          validator: [
            number({
              size: 1,
            }),
          ],
          transform: val => Number(val),
        },
      ],
    );

    expect(reject?.length).toBe(2);
    expect(reject?.[0].label).toBe('用户');
    expect(reject?.[0].message).toBe('The length can only be 2');
    expect(reject?.[1].message).toBe('not be null');
  });

  test('child schema & eachSchema', () => {
    const verify2 = createVerify({
      verifyFirst: false,
    });

    const rejects = verify2.check(
      {
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
      },
      [
        {
          name: 'name',
          validator: [required(), string({ length: 4 })],
        },
        {
          name: 'list',
          validator: [required(), array()],
          eachSchema: {
            validator: [required(), string()],
          },
        },
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
      ],
    );

    expect(rejects?.length).toBe(8);
  });

  test('argument', () => {
    function fn(...args: [string, number]) {
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

      expect(rejects?.length).toBe(1);
    }

    // @ts-ignore
    fn();
  });
});
