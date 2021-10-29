exports = function(rowGroupCols) {
  let groupId = {};
  let project = {};
  const id = [];
  rowGroupCols.forEach(element => {
    groupId = Object.assign({}, groupId, {[element.id]: `$${element.id}`});
    project = Object.assign({}, project, {[element.id]: `$_id.${element.id}`});
    id.push(`$_id.${element.id}`);
  });
  project = Object.assign({}, project, {"id": {"$concat": id}});
  
  let groupBody = {};
  context.values.get("olympicWinnersGroupDefinition").forEach(element => {
    groupBody = Object.assign(
      {},
      groupBody,
      {
        [element.fieldName]: {[`$${element.accumulator}`]: `$${element.fieldName}`}
      });
  });
  
  const pipeline = [
    {"$group": Object.assign({"_id": groupId}, groupBody)},
    {"$set": project},
    {"$unset": ["_id"]}
  ];
  
  return pipeline;
};