import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mock,
  vitest,
} from 'vitest';

import 'reflect-metadata';

vitest.mock('./getOwnReflectMetadata');

import { getOwnReflectMetadata } from './getOwnReflectMetadata';
import { updateOwnReflectMetadata } from './updateOwnReflectMetadata';

describe(updateOwnReflectMetadata.name, () => {
  describe('when called, and getOwnReflectMetadata returns undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    let targetFixture: Function;
    let metadataKeyFixture: unknown;
    let buildDefaultValueMock: Mock<() => unknown>;
    let defaultValueFixture: unknown;
    let callbackMock: Mock<(value: unknown) => unknown>;
    let reflectMetadata: unknown;

    beforeAll(() => {
      targetFixture = class {};
      defaultValueFixture = 'default-value';
      metadataKeyFixture = 'sample-key';
      buildDefaultValueMock = vitest.fn(() => defaultValueFixture);
      callbackMock = vitest
        .fn<(value: unknown) => unknown>()
        .mockImplementationOnce((value: unknown) => value);

      vitest.mocked(getOwnReflectMetadata).mockReturnValueOnce(undefined);

      updateOwnReflectMetadata(
        targetFixture,
        metadataKeyFixture,
        buildDefaultValueMock,
        callbackMock,
      );

      reflectMetadata = Reflect.getOwnMetadata(
        metadataKeyFixture,
        targetFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getOwnReflectMetadata()', () => {
      expect(getOwnReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getOwnReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        metadataKeyFixture,
      );
    });

    it('should call buildDefaultValue', () => {
      expect(buildDefaultValueMock).toHaveBeenCalledTimes(1);
      expect(buildDefaultValueMock).toHaveBeenCalledWith();
    });

    it('should call callback()', () => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(defaultValueFixture);
    });

    it('should define metadata', () => {
      expect(reflectMetadata).toBe(defaultValueFixture);
    });
  });

  describe('when called, and getOwnReflectMetadata returns metadata', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    let targetFixture: Function;
    let metadataFixture: unknown;
    let metadataKeyFixture: unknown;
    let buildDefaultValueMock: Mock<() => unknown>;
    let callbackMock: Mock<(value: unknown) => unknown>;
    let reflectMetadata: unknown;

    beforeAll(() => {
      targetFixture = class {};
      metadataFixture = 'metadata';
      metadataKeyFixture = 'sample-key';
      buildDefaultValueMock = vitest.fn();
      callbackMock = vitest
        .fn<(value: unknown) => unknown>()
        .mockImplementationOnce((value: unknown) => value);

      vitest.mocked(getOwnReflectMetadata).mockReturnValueOnce(metadataFixture);

      updateOwnReflectMetadata(
        targetFixture,
        metadataKeyFixture,
        buildDefaultValueMock,
        callbackMock,
      );

      reflectMetadata = Reflect.getOwnMetadata(
        metadataKeyFixture,
        targetFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getOwnReflectMetadata()', () => {
      expect(getOwnReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getOwnReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        metadataKeyFixture,
      );
    });

    it('should not call buildDefaultValue()', () => {
      expect(buildDefaultValueMock).not.toHaveBeenCalled();
    });

    it('should call callback()', () => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(metadataFixture);
    });

    it('should define metadata', () => {
      expect(reflectMetadata).toBe(metadataFixture);
    });
  });
});
