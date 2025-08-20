import { categoryNames } from '../../constants/inputVars.js';
import parseString from '../parseValues/parseString.js';

const parseFilterQuery = query => {
  let username = '';
  let productName = '';
  let category = categoryNames[0];
  const parseQuery = {};
  if (query.username) {
    const temp = parseString(query.username);
    username = temp ? temp : username;
    parseQuery.username = username;
  }
  if (query.product) {
    const temp = parseString(query.product);
    productName = temp ? temp : productName;
    parseQuery.product = productName;
  }
  if (query.category) {
    const temp = parseString(query.category);
    category = temp ? temp : category;
    parseQuery.category = category;
  }
  return parseQuery;
};

export default parseFilterQuery;
