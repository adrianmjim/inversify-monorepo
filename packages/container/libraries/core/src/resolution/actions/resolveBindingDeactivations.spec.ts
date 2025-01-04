import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./resolveBindingServiceDeactivations');

import { ConstantValueBindingFixtures } from '../../binding/fixtures/ConstantValueBindingFixtures';
import { ConstantValueBinding } from '../../binding/models/ConstantValueBinding';
import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingDeactivations } from './resolveBindingDeactivations';
import { resolveBindingServiceDeactivations } from './resolveBindingServiceDeactivations';

describe(resolveBindingDeactivations.name, () => {
  describe('having a binding with no deactivation', () => {
    let paramsMock: jest.Mocked<DeactivationParams>;
    let bindingFixture: ConstantValueBinding<unknown>;
    let resolvedValue: unknown;

    beforeAll(() => {
      paramsMock = {
        getBindings: jest.fn(),
        getDeactivations: jest.fn(),
      } as Partial<
        jest.Mocked<DeactivationParams>
      > as jest.Mocked<DeactivationParams>;
      bindingFixture = ConstantValueBindingFixtures.withOnDeactivationUndefined;
      resolvedValue = Symbol();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveBindingDeactivations(
          paramsMock,
          bindingFixture,
          resolvedValue,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call resolveBindingServiceDeactivations()', () => {
        expect(resolveBindingServiceDeactivations).toHaveBeenCalledTimes(1);
        expect(resolveBindingServiceDeactivations).toHaveBeenCalledWith(
          paramsMock,
          bindingFixture.serviceIdentifier,
          bindingFixture.cache.value,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a binding with sync deactivation', () => {
    let paramsMock: jest.Mocked<DeactivationParams>;
    let bindingFixture: ConstantValueBinding<unknown>;
    let resolvedValue: unknown;

    beforeAll(() => {
      paramsMock = {
        getBindings: jest.fn(),
        getDeactivations: jest.fn(),
      } as Partial<
        jest.Mocked<DeactivationParams>
      > as jest.Mocked<DeactivationParams>;
      bindingFixture = ConstantValueBindingFixtures.withOnDeactivationSync;
      resolvedValue = Symbol();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveBindingDeactivations(
          paramsMock,
          bindingFixture,
          resolvedValue,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call resolveBindingServiceDeactivations()', () => {
        expect(resolveBindingServiceDeactivations).toHaveBeenCalledTimes(1);
        expect(resolveBindingServiceDeactivations).toHaveBeenCalledWith(
          paramsMock,
          bindingFixture.serviceIdentifier,
          bindingFixture.cache.value,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a binding with async deactivation', () => {
    let paramsMock: jest.Mocked<DeactivationParams>;
    let bindingFixture: ConstantValueBinding<unknown>;
    let resolvedValue: unknown;

    beforeAll(() => {
      paramsMock = {
        getBindings: jest.fn(),
        getDeactivations: jest.fn(),
      } as Partial<
        jest.Mocked<DeactivationParams>
      > as jest.Mocked<DeactivationParams>;
      bindingFixture = ConstantValueBindingFixtures.withOnDeactivationAsync;
      resolvedValue = Symbol();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveBindingDeactivations(
          paramsMock,
          bindingFixture,
          resolvedValue,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call resolveBindingServiceDeactivations()', () => {
        expect(resolveBindingServiceDeactivations).toHaveBeenCalledTimes(1);
        expect(resolveBindingServiceDeactivations).toHaveBeenCalledWith(
          paramsMock,
          bindingFixture.serviceIdentifier,
          bindingFixture.cache.value,
        );
      });

      it('should return Promise', () => {
        expect(result).toStrictEqual(Promise.resolve(undefined));
      });
    });
  });
});
