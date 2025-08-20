const parseBoolean = boolVal => {
  if (typeof boolVal !== 'string') return;
  const parseValue = boolVal && JSON.parse(boolVal);
  if (typeof boolVal === 'boolean') return parseValue;
};

export default parseBoolean;
