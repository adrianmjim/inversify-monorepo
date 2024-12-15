import {
  getReflectMetadata,
  setReflectMetadata,
  updateReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

const ID_METADATA: string = '@inversifyjs/container/bindingId';

export function getBindingId(): number {
  const bindingId: number =
    getReflectMetadata<number>(Object, ID_METADATA) ?? 0;

  if (bindingId === Number.MAX_SAFE_INTEGER) {
    setReflectMetadata(Object, ID_METADATA, Number.MIN_SAFE_INTEGER);
  } else {
    updateReflectMetadata(
      Object,
      ID_METADATA,
      () => bindingId,
      (id: number) => id + 1,
    );
  }

  return bindingId;
}
