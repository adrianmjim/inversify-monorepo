import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { controllerMetadataReflectKey } from '../../reflectMetadata/data/controllerMetadataReflectKey';
import { exploreControllers } from './exploreControllers';

describe(exploreControllers.name, () => {
  describe('when called', () => {
    let controllerMetadataFixture: undefined;
    let result: unknown;

    beforeAll(() => {
      controllerMetadataFixture = undefined;

      result = exploreControllers();
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        Reflect,
        controllerMetadataReflectKey,
      );
    });

    it('should return the controller metadata', () => {
      expect(result).toBe(controllerMetadataFixture);
    });
  });
});
