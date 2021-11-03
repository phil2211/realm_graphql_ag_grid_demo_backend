exports = function({rowGroupCols, groupKeys, valueCols}) {
  let groupsToUse = rowGroupCols.slice(groupKeys.length, groupKeys.length + 1);
  let groupId = {};
  let project = {};
  const id = [];
  groupId = Object.assign({}, groupId, {[groupsToUse[0].id]: `$${groupsToUse[0].id}`});
  project = Object.assign({}, project, {[groupsToUse[0].id]: `$_id.${groupsToUse[0].id}`});

  let groupBody = {};
  valueCols.forEach(element => {
    groupBody = Object.assign(
      {},
      groupBody,
      {
        [element.field]: {[`$${element.aggFunc}`]: `$${element.field}`}
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
  "United States"
]

const valueCols = [
  {
    "id": "gold",
    "aggFunc": "sum",
    "displayName": "Gold",
    "field": "gold"
  },
  {
    "id": "silver",
    "aggFunc": "sum",
    "displayName": "Silver",
    "field": "silver"
  },
  {
    "id": "bronze",
    "aggFunc": "sum",
    "displayName": "Bronze",
    "field": "bronze"
  },
  {
    "id": "total",
    "aggFunc": "sum",
    "displayName": "Total",
    "field": "total"
  }
]

exports({rowGroupCols, groupKeys, valueCols})

*/