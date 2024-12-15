import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import {
  getReflectMetadata,
  setReflectMetadata,
  updateReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { getTargetId } from './getTargetId';

describe(getTargetId.name, () => {
  describe('when called, and getReflectMetadata() returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(0);

      result = getTargetId();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        Object,
        '@inversifyjs/core/targetId',
      );
    });

    it('should call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateReflectMetadata).toHaveBeenCalledWith(
        Object,
        '@inversifyjs/core/targetId',
        expect.any(Function),
        expect.any(Function),
      );
    });

    it('should return default id', () => {
      expect(result).toBe(0);
    });
  });

  describe('when called, and getReflectMetadata() returns Number.MAX_SAFE_INTEGER', () => {
    let result: unknown;

    beforeAll(() => {
      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(Number.MAX_SAFE_INTEGER);

      result = getTargetId();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        Object,
        '@inversifyjs/core/targetId',
      );
    });

    it('should call setReflectMetadata()', () => {
      expect(setReflectMetadata).toHaveBeenCalledTimes(1);
      expect(setReflectMetadata).toHaveBeenCalledWith(
        Object,
        '@inversifyjs/core/targetId',
        Number.MIN_SAFE_INTEGER,
      );
    });

    it('should return default id', () => {
      expect(result).toBe(Number.MAX_SAFE_INTEGER);
    });
  });
});
