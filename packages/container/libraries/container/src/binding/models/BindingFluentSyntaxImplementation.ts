import { Newable, ServiceIdentifier } from '@inversifyjs/common';
import {
  Binding,
  BindingActivation,
  BindingDeactivation,
  BindingMetadata,
  BindingScope,
  bindingScopeValues,
  BindingType,
  bindingTypeValues,
  ClassMetadata,
  ConstantValueBinding,
  DynamicValueBinding,
  DynamicValueBuilder,
  Factory,
  FactoryBinding,
  getClassMetadata,
  InstanceBinding,
  MetadataName,
  MetadataTag,
  Provider,
  ProviderBinding,
  ResolutionContext,
  Resolved,
  ScopedBinding,
  ServiceRedirectionBinding,
} from '@inversifyjs/core';

import { Writable } from '../../common/models/Writable';
import { BindingConstraintUtils } from '../../container/binding/utils/BindingConstraintUtils';
import { getBindingId } from '../actions/getBindingId';
import { isAnyAncestorBindingMetadata } from '../calculations/isAnyAncestorBindingMetadata';
import { isAnyAncestorBindingMetadataWithName } from '../calculations/isAnyAncestorBindingMetadataWithName';
import { isAnyAncestorBindingMetadataWithServiceId } from '../calculations/isAnyAncestorBindingMetadataWithServiceId';
import { isAnyAncestorBindingMetadataWithTag } from '../calculations/isAnyAncestorBindingMetadataWithTag';
import { isBindingMetadataWithName } from '../calculations/isBindingMetadataWithName';
import { isBindingMetadataWithNoNameNorTags } from '../calculations/isBindingMetadataWithNoNameNorTags';
import { isBindingMetadataWithTag } from '../calculations/isBindingMetadataWithTag';
import { isNotParentBindingMetadata } from '../calculations/isNotParentBindingMetadata';
import { isNotParentBindingMetadataWithName } from '../calculations/isNotParentBindingMetadataWithName';
import { isNotParentBindingMetadataWithServiceId } from '../calculations/isNotParentBindingMetadataWithServiceId';
import { isNotParentBindingMetadataWithTag } from '../calculations/isNotParentBindingMetadataWithTag';
import { isParentBindingMetadata } from '../calculations/isParentBindingMetadata';
import { isParentBindingMetadataWithName } from '../calculations/isParentBindingMetadataWithName';
import { isParentBindingMetadataWithServiceId } from '../calculations/isParentBindingMetadataWithServiceId';
import { isParentBindingMetadataWithTag } from '../calculations/isParentBindingMetadataWithTag';
import {
  BindInFluentSyntax,
  BindInWhenOnFluentSyntax,
  BindOnFluentSyntax,
  BindToFluentSyntax,
  BindWhenFluentSyntax,
  BindWhenOnFluentSyntax,
} from './BindingFluentSyntax';

export class BindInFluentSyntaxImplementation<T>
  implements BindInFluentSyntax<T>
{
  readonly #binding: Writable<ScopedBinding<BindingType, BindingScope, T>>;

  constructor(binding: Writable<ScopedBinding<BindingType, BindingScope, T>>) {
    this.#binding = binding;
  }

  public inRequestScope(): BindWhenOnFluentSyntax<T> {
    this.#binding.scope = bindingScopeValues.Request;

    return new BindWhenOnFluentSyntaxImplementation(this.#binding);
  }

  public inSingletonScope(): BindWhenOnFluentSyntax<T> {
    this.#binding.scope = bindingScopeValues.Singleton;

    return new BindWhenOnFluentSyntaxImplementation(this.#binding);
  }

  public inTransientScope(): BindWhenOnFluentSyntax<T> {
    this.#binding.scope = bindingScopeValues.Transient;

    return new BindWhenOnFluentSyntaxImplementation(this.#binding);
  }
}

export class BindToFluentSyntaxImplementation<T>
  implements BindToFluentSyntax<T>
{
  readonly #callback: (binding: Binding<T>) => void;
  readonly #containerModuleId: number | undefined;
  readonly #defaultScope: BindingScope;
  readonly #serviceIdentifier: ServiceIdentifier<T>;

  constructor(
    callback: (binding: Binding<T>) => void,
    containerModuleId: number | undefined,
    defaultScope: BindingScope,
    serviceIdentifier: ServiceIdentifier<T>,
  ) {
    this.#callback = callback;
    this.#containerModuleId = containerModuleId;
    this.#defaultScope = defaultScope;
    this.#serviceIdentifier = serviceIdentifier;
  }

  public to(type: Newable<T>): BindInWhenOnFluentSyntax<T> {
    const classMetadata: ClassMetadata = getClassMetadata(type);

    const binding: InstanceBinding<T> = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: getBindingId(),
      implementationType: type,
      isSatisfiedBy: BindingConstraintUtils.always,
      moduleId: this.#containerModuleId,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: classMetadata.scope ?? this.#defaultScope,
      serviceIdentifier: this.#serviceIdentifier,
      type: bindingTypeValues.Instance,
    };

    this.#callback(binding);

    return new BindInWhenOnFluentSyntaxImplementation<T>(binding);
  }

  public toSelf(): BindInWhenOnFluentSyntax<T> {
    if (typeof this.#serviceIdentifier !== 'function') {
      throw new Error(
        '"toSelf" function can only be applied when a newable function is used as service identifier',
      );
    }

    return this.to(this.#serviceIdentifier as Newable<T>);
  }

  public toConstantValue(value: T): BindWhenOnFluentSyntax<T> {
    const binding: ConstantValueBinding<T> = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: getBindingId(),
      isSatisfiedBy: BindingConstraintUtils.always,
      moduleId: this.#containerModuleId,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: this.#serviceIdentifier,
      type: bindingTypeValues.ConstantValue,
      value: value as Resolved<T>,
    };

    this.#callback(binding);

    return new BindWhenOnFluentSyntaxImplementation<T>(binding);
  }

  public toDynamicValue(
    builder: DynamicValueBuilder<T>,
  ): BindInWhenOnFluentSyntax<T> {
    const binding: DynamicValueBinding<T> = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: getBindingId(),
      isSatisfiedBy: BindingConstraintUtils.always,
      moduleId: this.#containerModuleId,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: this.#serviceIdentifier,
      type: bindingTypeValues.DynamicValue,
      value: builder,
    };

    this.#callback(binding);

    return new BindInWhenOnFluentSyntaxImplementation(binding);
  }

  public toFactory(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    builder: T extends Factory<unknown, any>
      ? (context: ResolutionContext) => T
      : never,
  ): BindWhenOnFluentSyntax<T> {
    const binding: FactoryBinding<Factory<unknown>> = {
      cache: {
        isRight: false,
        value: undefined,
      },
      factory: builder,
      id: getBindingId(),
      isSatisfiedBy: BindingConstraintUtils.always,
      moduleId: this.#containerModuleId,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: this.#serviceIdentifier,
      type: bindingTypeValues.Factory,
    };

    this.#callback(binding as Binding as Binding<T>);

    return new BindWhenOnFluentSyntaxImplementation<T>(
      binding as Writable<ScopedBinding<BindingType, BindingScope, T>>,
    );
  }

  public toProvider(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    provider: T extends Provider<unknown, any>
      ? (context: ResolutionContext) => T
      : never,
  ): BindWhenOnFluentSyntax<T> {
    const binding: ProviderBinding<Provider<unknown>> = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: getBindingId(),
      isSatisfiedBy: BindingConstraintUtils.always,
      moduleId: this.#containerModuleId,
      onActivation: undefined,
      onDeactivation: undefined,
      provider,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: this.#serviceIdentifier,
      type: bindingTypeValues.Provider,
    };

    this.#callback(binding as Binding as Binding<T>);

    return new BindWhenOnFluentSyntaxImplementation<T>(
      binding as Writable<ScopedBinding<BindingType, BindingScope, T>>,
    );
  }

  public toService(service: ServiceIdentifier<T>): void {
    const binding: ServiceRedirectionBinding<T> = {
      id: getBindingId(),
      isSatisfiedBy: BindingConstraintUtils.always,
      moduleId: this.#containerModuleId,
      serviceIdentifier: this.#serviceIdentifier,
      targetServiceIdentifier: service,
      type: bindingTypeValues.ServiceRedirection,
    };

    this.#callback(binding);
  }
}

export class BindOnFluentSyntaxImplementation<T>
  implements BindOnFluentSyntax<T>
{
  readonly #binding: Writable<ScopedBinding<BindingType, BindingScope, T>>;

  constructor(binding: Writable<ScopedBinding<BindingType, BindingScope, T>>) {
    this.#binding = binding;
  }

  public onActivation(
    activation: BindingActivation<T>,
  ): BindWhenFluentSyntax<T> {
    this.#binding.onActivation = activation;

    return new BindWhenFluentSyntaxImplementation(this.#binding);
  }

  public onDeactivation(
    deactivation: BindingDeactivation<T>,
  ): BindWhenFluentSyntax<T> {
    this.#binding.onDeactivation = deactivation;

    return new BindWhenFluentSyntaxImplementation(this.#binding);
  }
}

export class BindWhenFluentSyntaxImplementation<T>
  implements BindWhenFluentSyntax<T>
{
  readonly #binding: Writable<ScopedBinding<BindingType, BindingScope, T>>;

  constructor(binding: Writable<ScopedBinding<BindingType, BindingScope, T>>) {
    this.#binding = binding;
  }

  public when(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T> {
    this.#binding.isSatisfiedBy = constraint;

    return new BindOnFluentSyntaxImplementation(this.#binding);
  }

  public whenAnyAncestor(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T> {
    return this.when(isAnyAncestorBindingMetadata(constraint));
  }

  public whenAnyAncestorIs(
    serviceIdentifier: ServiceIdentifier,
  ): BindOnFluentSyntax<T> {
    return this.when(
      isAnyAncestorBindingMetadataWithServiceId(serviceIdentifier),
    );
  }

  public whenAnyAncestorNamed(name: MetadataName): BindOnFluentSyntax<T> {
    return this.when(isAnyAncestorBindingMetadataWithName(name));
  }

  public whenAnyAncestorTagged(
    tag: MetadataTag,
    tagValue: unknown,
  ): BindOnFluentSyntax<T> {
    return this.when(isAnyAncestorBindingMetadataWithTag(tag, tagValue));
  }

  public whenDefault(): BindOnFluentSyntax<T> {
    return this.when(isBindingMetadataWithNoNameNorTags);
  }

  public whenNamed(name: MetadataName): BindOnFluentSyntax<T> {
    return this.when(isBindingMetadataWithName(name));
  }

  public whenNoParent(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T> {
    return this.when(isNotParentBindingMetadata(constraint));
  }

  public whenNoParentIs(
    serviceIdentifier: ServiceIdentifier,
  ): BindOnFluentSyntax<T> {
    return this.when(
      isNotParentBindingMetadataWithServiceId(serviceIdentifier),
    );
  }

  public whenNoParentNamed(name: MetadataName): BindOnFluentSyntax<T> {
    return this.when(isNotParentBindingMetadataWithName(name));
  }

  public whenNoParentTagged(
    tag: MetadataTag,
    tagValue: unknown,
  ): BindOnFluentSyntax<T> {
    return this.when(isNotParentBindingMetadataWithTag(tag, tagValue));
  }

  public whenParent(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T> {
    return this.when(isParentBindingMetadata(constraint));
  }

  public whenParentIs(
    serviceIdentifier: ServiceIdentifier,
  ): BindOnFluentSyntax<T> {
    return this.when(isParentBindingMetadataWithServiceId(serviceIdentifier));
  }

  public whenParentNamed(name: MetadataName): BindOnFluentSyntax<T> {
    return this.when(isParentBindingMetadataWithName(name));
  }

  public whenParentTagged(
    tag: MetadataTag,
    tagValue: unknown,
  ): BindOnFluentSyntax<T> {
    return this.when(isParentBindingMetadataWithTag(tag, tagValue));
  }

  public whenTagged(
    tag: MetadataTag,
    tagValue: unknown,
  ): BindOnFluentSyntax<T> {
    return this.when(isBindingMetadataWithTag(tag, tagValue));
  }
}

export class BindWhenOnFluentSyntaxImplementation<T>
  extends BindWhenFluentSyntaxImplementation<T>
  implements BindWhenOnFluentSyntax<T>
{
  readonly #bindOnFluentSyntax: BindOnFluentSyntax<T>;

  constructor(binding: Writable<ScopedBinding<BindingType, BindingScope, T>>) {
    super(binding);

    this.#bindOnFluentSyntax = new BindOnFluentSyntaxImplementation(binding);
  }

  public onActivation(
    activation: BindingActivation<T>,
  ): BindWhenFluentSyntax<T> {
    return this.#bindOnFluentSyntax.onActivation(activation);
  }

  public onDeactivation(
    deactivation: BindingDeactivation<T>,
  ): BindWhenFluentSyntax<T> {
    return this.#bindOnFluentSyntax.onDeactivation(deactivation);
  }
}

export class BindInWhenOnFluentSyntaxImplementation<T>
  extends BindWhenOnFluentSyntaxImplementation<T>
  implements BindInWhenOnFluentSyntax<T>
{
  readonly #bindInFluentSyntax: BindInFluentSyntax<T>;

  constructor(binding: Writable<ScopedBinding<BindingType, BindingScope, T>>) {
    super(binding);

    this.#bindInFluentSyntax = new BindInFluentSyntaxImplementation(binding);
  }

  public inRequestScope(): BindWhenOnFluentSyntax<T> {
    return this.#bindInFluentSyntax.inRequestScope();
  }

  public inSingletonScope(): BindWhenOnFluentSyntax<T> {
    return this.#bindInFluentSyntax.inSingletonScope();
  }

  public inTransientScope(): BindWhenOnFluentSyntax<T> {
    return this.#bindInFluentSyntax.inTransientScope();
  }
}
