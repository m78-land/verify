import { array, createVerify, number, object, required, string } from '@m78/verify';

const verify = createVerify({
  verifyFirst: false,
});

// console.log(
//   verify.check(
//     {
//       name: '',
//       list: ['124', '632', ''],
//       map: {
//         address: '',
//         time: '1',
//       },
//       listMap: [
//         {
//           key: '142',
//         },
//         {
//           key: '',
//         },
//         {
//           key: '4214',
//         },
//       ],
//       listList: [['xxx'], ['xxx'], 12321],
//     },
//     [
//       {
//         name: 'name',
//         validator: [required()],
//       },
//       {
//         name: 'list',
//         validator: [required(), array()],
//         eachSchema: {
//           validator: [required()],
//         },
//       },
//       {
//         name: 'map',
//         validator: [object()],
//         schema: [
//           {
//             name: 'address',
//             validator: [required()],
//           },
//           {
//             name: 'time',
//             validator: [required()],
//           },
//         ],
//       },
//       {
//         name: 'listMap',
//         validator: [required(), array()],
//         eachSchema: {
//           validator: [object()],
//           schema: [
//             {
//               name: 'key',
//               validator: [required()],
//             },
//             {
//               name: 'key2',
//               validator: [required()],
//             },
//           ],
//         },
//       },
//       {
//         name: 'listList',
//         validator: [required(), array()],
//         eachSchema: {
//           validator: [array()],
//           eachSchema: {
//             validator: [number()],
//           },
//         },
//       },
//     ],
//   ),
// );

verify
  .asyncCheck(
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
  )
  .then(res => {
    console.log(res);
  });
