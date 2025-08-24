const updateObjects = obj => {
  const updatedObj = {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key) && obj[key] !== undefined && obj[key] !== null) {
      updatedObj[key] = obj[key];
    }
  }
  return updatedObj;
};

export default updateObjects;
