exports = function({groupKeys, rowGroupCols}) {
  let match = {};
  rowGroupCols.forEach((element, index) => {
    match = Object.assign({}, match, {[element.id]: groupKeys[index]});
  });
  
  return {"$match": match};
};