
export default function addConstant(clazz, name, value) {
  Object.defineProperty(clazz, name, {
      value: value,
      writable : false,
      enumerable : true,
      configurable : false
  });
};
