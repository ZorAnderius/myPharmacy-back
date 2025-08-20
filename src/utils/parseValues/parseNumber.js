const parseNumber = (num, defNum) => {
  if (typeof num !== 'string') return defNum;
  return isNaN(Number(num)) ? defNum : Number(num);
};

export default parseNumber;
