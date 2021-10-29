exports = function(rowGroupCols) {
  let groupId = {};
  rowGroupCols.forEach(element => {
    groupId = Object.assign({}, groupId, {[element.id]: `$${element.id}`});
  });
  return groupId;
};