// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#examples
function getClonableReplacer() {
  const ancestors: any[] = [];

  function replacer(this: any, key: string, value: any) {
    if (typeof value === 'function') {
      return '[Function]';
    }
    if (typeof value !== 'object' || value === null) {
      return value;
    }
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return '[Circular]';
    }
    ancestors.push(value);
    return value;
  }

  return replacer;
}

const errorToPlainObject = (err: Error): Record<string, any> => {
  const plain: Record<string, any> = {};
  plain.name = err.name;
  plain.message = err.message;
  if (err.stack) {
    plain.stack = err.stack;
  }
  for (const key of Object.keys(err)) {
    plain[key] = (err as any)[key];
  }
  return plain;
};

function getErrorAwareReplacer() {
  const baseReplacer = getClonableReplacer();

  return function (this: any, key: string, value: any) {
    if (value instanceof Error) {
      return errorToPlainObject(value);
    }
    return baseReplacer.call(this, key, value);
  };
}

export const objectToCloneableObject = (obj: object) => {
  if (obj instanceof Error) {
    return errorToPlainObject(obj);
  }
  return JSON.parse(JSON.stringify(obj, getErrorAwareReplacer()));
};
