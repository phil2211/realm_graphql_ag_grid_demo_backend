exports = function({rowGroupCols, groupKeys}) {
  let groupsToUse = rowGroupCols.slice(groupKeys.length, groupKeys.length + 1);
  console.log(JSON.stringify(groupsToUse))
  let groupId = {};
  let project = {};
  const id = [];
  groupId = Object.assign({}, groupId, {[groupsToUse[0].id]: `$${groupsToUse[0].id}`});
  project = Object.assign({}, project, {[groupsToUse[0].id]: `$_id.${groupsToUse[0].id}`});
  //project = Object.assign({}, project, {"id": {"$concat": id}});
  
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


/*
Testdata
========

const rowGroupCols=[
  {
    "id": "country",
    "displayName": "Country",
    "field": "country"
  },
  {
    "id": "sport",
    "displayName": "Sport",
    "field": "sport"
  }
]

const groupKeys = [
  "United States",
  "Swimming"
]

exports({rowGroupCols, groupKeys})

*/