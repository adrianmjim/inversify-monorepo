import { BindingMetadata } from '@inversifyjs/core';

export function isNotParentBindingMetadata(
  constraint: (metadata: BindingMetadata) => boolean,
): (metadata: BindingMetadata) => boolean {
  return (metadata: BindingMetadata): boolean => {
    const ancestorMetadata: BindingMetadata | undefined =
      metadata.getAncestor();

    return ancestorMetadata === undefined || !constraint(ancestorMetadata);
  };
}
