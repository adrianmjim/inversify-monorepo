import { beforeAll, describe, expect, it } from '@jest/globals';

import 'reflect-metadata';

import { getOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';
import { tagged } from './tagged';

describe(tagged.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @tagged('bar', 'bar-value')
        public readonly bar!: string;

        @tagged('baz', 'baz-value')
        public readonly baz!: string;

        constructor(
          @tagged('firstParam', 'firstParam-value')
          public firstParam: number,
          @tagged('secondParam', 'secondParam-value')
          public secondParam: number,
        ) {}
      }

      result = getOwnReflectMetadata(Foo, classMetadataReflectKey);
    });

    it('should return expected metadata', () => {
      const expected: MaybeClassMetadata = {
        constructorArguments: [
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: undefined,
            optional: false,
            tags: new Map([['firstParam', 'firstParam-value']]),
          },
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: undefined,
            optional: false,
            tags: new Map([['secondParam', 'secondParam-value']]),
          },
        ],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map([
          [
            'bar',
            {
              kind: MaybeClassElementMetadataKind.unknown,
              name: undefined,
              optional: false,
              tags: new Map([['bar', 'bar-value']]),
            },
          ],
          [
            'baz',
            {
              kind: MaybeClassElementMetadataKind.unknown,
              name: undefined,
              optional: false,
              tags: new Map([['baz', 'baz-value']]),
            },
          ],
        ]),
        scope: undefined,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
