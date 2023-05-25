/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
class InnerClassObject {
  public innerFunc1() {
    return true;
  }

  public innerFunc2() {
    return true;
  }
}

class ClassObject {
  public property: InnerClassObject;

  constructor() {
    this.property = new InnerClassObject();
  }

  public func1() {
    return true;
  }

  public func2() {
    return true;
  }
}

const arrowFunctionObject = {
  func1: jest.fn().mockReturnValue(true),
  func2: jest.fn().mockReturnValue(true),
  property: {
    innerFunc1: jest.fn().mockReturnValue(true),
    innerFunc2: jest.fn().mockReturnValue(true),
  },
};

const classObject = new ClassObject();

export const fixtures = [
  {
    name: 'Depth 1, with arrow func',
    params: {
      obj: arrowFunctionObject,
      depth: 1,
    },
    methodList: ['func1', 'func2'],
    calls: [
      {
        method: 'func1',
        args: ['testParam'],
        result: true,
        func: arrowFunctionObject.func1,
      },
      {
        method: 'func2',
        args: ['testParam'],
        result: true,
        func: arrowFunctionObject.func2,
      },
    ],
  },
  {
    name: 'Depth 2, with arrow func',
    params: {
      obj: arrowFunctionObject,
      depth: 2,
    },
    methodList: [
      'func1',
      'func2',
      'property.innerFunc1',
      'property.innerFunc2',
    ],
    calls: [
      {
        method: 'property.innerFunc1',
        args: ['testParam'],
        result: true,
        func: arrowFunctionObject.property.innerFunc1,
      },
      {
        method: 'property.innerFunc2',
        args: ['testParam'],
        result: true,
        func: arrowFunctionObject.property.innerFunc2,
      },
    ],
  },
  {
    name: 'Depth 1, with class obj',
    params: {
      obj: classObject,
      depth: 1,
    },
    methodList: ['func1', 'func2'],
    calls: [
      {
        method: 'func1',
        args: ['testParam'],
        result: true,
        func: undefined,
      },
      {
        method: 'func2',
        args: ['testParam'],
        result: true,
        func: undefined,
      },
    ],
  },
  {
    name: 'Depth 2, with class obj',
    params: {
      obj: classObject,
      depth: 2,
    },
    methodList: [
      'func1',
      'func2',
      'property.innerFunc1',
      'property.innerFunc2',
    ],
    calls: [
      {
        method: 'property.innerFunc1',
        args: ['testParam'],
        result: true,
        func: undefined,
      },
      {
        method: 'property.innerFunc2',
        args: ['testParam'],
        result: true,
        func: undefined,
      },
    ],
  },
];
