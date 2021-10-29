exports = function({groupKeys, rowGroupCols}) {
  let match = {};
  groupKeys.forEach((element, index) => {
    match = Object.assign({}, match, {[rowGroupCols[index].id]: element});
  });
  
  return {"$match": match};
};