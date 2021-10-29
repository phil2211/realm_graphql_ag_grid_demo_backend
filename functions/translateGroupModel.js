exports = function(rowGroupCols) {
  let groupId = {};
  let project = {};
  const _id = [];
  rowGroupCols.forEach(element => {
    groupId = Object.assign({}, groupId, {[element.id]: `$${element.id}`});
    project = Object.assign({}, project, {[element.id]: `$_id.${element.id}`});
  });
  project = Object.assign({}, project, {"_id": "$id"});
  
  let groupBody = {};
  context.values.get("olympicWinnersGroupDefinition").forEach(element => {
    groupBody = Object.assign(
      {},
      groupBody,
      {
        [element.fieldName]: {[`$${element.accumulator}`]: `$${element.fieldName}`}
      });
  });
  groupBody = Object.assign({}, groupBody, {"id":{"$first": "$_id"}});
  
  
  const pipeline = [
    {"$group": Object.assign({"_id": groupId}, groupBody)},
    {"$set": project},
    {"$unset": ["id"]}
  ];
  
  return pipeline;
};