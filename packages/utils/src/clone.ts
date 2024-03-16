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

export const objectToCloneableObject = (obj: object) =>
  JSON.parse(JSON.stringify(obj, getClonableReplacer()));
