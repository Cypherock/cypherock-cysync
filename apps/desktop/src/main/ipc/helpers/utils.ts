const getMethodListFromProperty = (
  rootObj: any,
  property: string,
  maxDepth: number,
  currentDepth = 1,
) => {
  const methodList: string[] = [];
  if (currentDepth > maxDepth) return methodList;

  const obj = rootObj[property];
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    const rootMethodList = Object.getOwnPropertyNames(
      Object.getPrototypeOf(obj),
    );
    methodList.push(...rootMethodList);

    const properties = Object.keys(obj);

    for (const innerProperty of properties) {
      const innerMethods = getMethodListFromProperty(
        obj,
        innerProperty,
        maxDepth,
        currentDepth + 1,
      );
      methodList.push(...innerMethods.map(e => `${property}.${e}`));
    }
  }

  return methodList;
};

export const getMethodListFromObject = (rootObj: any, maxDepth = 2) => {
  const methodList = [];

  const rootMethods = Object.getOwnPropertyNames(
    Object.getPrototypeOf(rootObj),
  );
  methodList.push(...rootMethods);

  const properties = Object.keys(rootObj);

  for (const property of properties) {
    const innerMethods = getMethodListFromProperty(
      rootObj,
      property,
      maxDepth - 1,
    );
    methodList.push(...innerMethods.map(e => `${property}.${e}`));
  }

  return methodList;
};

export const callMethodOnObject = async (
  rootObj: any,
  method: string,
  ...args: any[]
) => {
  const methodHeirarchy = method.split('.');

  let obj = rootObj;
  for (let i = 0; i < methodHeirarchy.length; i += 1) {
    const isLast = i >= methodHeirarchy.length - 1;
    const currentHeirarchy = methodHeirarchy[i];

    if (isLast) {
      return obj[currentHeirarchy](...args);
    }

    obj = rootObj[currentHeirarchy];
  }

  return undefined;
};
