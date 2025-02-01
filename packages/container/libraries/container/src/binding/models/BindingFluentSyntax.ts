import { Newable, ServiceIdentifier } from '@inversifyjs/common';
import {
  BindingActivation,
  BindingDeactivation,
  BindingMetadata,
  DynamicValueBuilder,
  Factory,
  MetadataName,
  MetadataTag,
  Provider,
  ResolutionContext,
} from '@inversifyjs/core';

import { ResolvedValueInjectOptions } from './ResolvedValueInjectOptions';

export interface BindToFluentSyntax<T> {
  to(type: Newable<T>): BindInWhenOnFluentSyntax<T>;
  toSelf(): BindInWhenOnFluentSyntax<T>;
  toConstantValue(value: T): BindWhenOnFluentSyntax<T>;
  toDynamicValue(builder: DynamicValueBuilder<T>): BindInWhenOnFluentSyntax<T>;
  toFactory(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    factory: T extends Factory<unknown, any>
      ? (context: ResolutionContext) => T
      : never,
  ): BindWhenOnFluentSyntax<T>;
  toProvider(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    provider: T extends Provider<unknown, any>
      ? (context: ResolutionContext) => T
      : never,
  ): BindWhenOnFluentSyntax<T>;
  toResolvedValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    factory: (...args: any[]) => T,
    injectOptions?: ResolvedValueInjectOptions<T>[],
  ): BindInWhenOnFluentSyntax<T>;
  toService(service: ServiceIdentifier<T>): void;
}

export interface BindInFluentSyntax<T> {
  inSingletonScope(): BindWhenOnFluentSyntax<T>;
  inTransientScope(): BindWhenOnFluentSyntax<T>;
  inRequestScope(): BindWhenOnFluentSyntax<T>;
}

export interface BindInWhenOnFluentSyntax<T>
  extends BindInFluentSyntax<T>,
    BindWhenOnFluentSyntax<T> {}

export interface BindOnFluentSyntax<T> {
  onActivation(activation: BindingActivation<T>): BindWhenFluentSyntax<T>;
  onDeactivation(deactivation: BindingDeactivation<T>): BindWhenFluentSyntax<T>;
}

export interface BindWhenOnFluentSyntax<T>
  extends BindWhenFluentSyntax<T>,
    BindOnFluentSyntax<T> {}

export interface BindWhenFluentSyntax<T> {
  when(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T>;
  whenAnyAncestor(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T>;
  whenAnyAncestorIs(
    serviceIdentifier: ServiceIdentifier,
  ): BindOnFluentSyntax<T>;
  whenAnyAncestorNamed(name: MetadataName): BindOnFluentSyntax<T>;
  whenAnyAncestorTagged(
    tag: MetadataTag,
    tagValue: unknown,
  ): BindOnFluentSyntax<T>;
  whenDefault(): BindOnFluentSyntax<T>;
  whenNamed(name: MetadataName): BindOnFluentSyntax<T>;
  whenNoAncestor(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T>;
  whenNoAncestorIs(serviceIdentifier: ServiceIdentifier): BindOnFluentSyntax<T>;
  whenNoAncestorNamed(name: MetadataName): BindOnFluentSyntax<T>;
  whenNoAncestorTagged(
    tag: MetadataTag,
    tagValue: unknown,
  ): BindOnFluentSyntax<T>;
  whenNoParent(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T>;
  whenNoParentIs(serviceIdentifier: ServiceIdentifier): BindOnFluentSyntax<T>;
  whenNoParentNamed(name: MetadataName): BindOnFluentSyntax<T>;
  whenNoParentTagged(
    tag: MetadataTag,
    tagValue: unknown,
  ): BindOnFluentSyntax<T>;
  whenParent(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T>;
  whenParentIs(serviceIdentifier: ServiceIdentifier): BindOnFluentSyntax<T>;
  whenParentNamed(name: MetadataName): BindOnFluentSyntax<T>;
  whenParentTagged(tag: MetadataTag, tagValue: unknown): BindOnFluentSyntax<T>;
  whenTagged(tag: MetadataTag, tagValue: unknown): BindOnFluentSyntax<T>;
}
