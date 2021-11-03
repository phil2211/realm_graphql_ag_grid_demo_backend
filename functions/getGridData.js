exports = async ({ startRow, endRow, sortModel=[], rowGroupCols=[], groupKeys=[], valueCols=[], filterModel=[] }) => {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("GridDemo").collection("OlympicWinners");
  
  //generate match in filter case
  const filterMatch = context.functions.execute('translateFilterMatchModel', filterModel);
  
  //generate match in grouping case and translate between string and int (because GraphQL schema in Realm only supports exactly one datatype as input)
  const match = context.functions.execute('translateMatchModel', {rowGroupCols, groupKeys: groupKeys.map(key => isNaN(parseInt(key)) ? key : parseInt(key))});
  
  const sort = {
    $sort: sortModel.length <= 0 ? {id:1} : context.functions.execute('translateSortModel', sortModel)
  };
  
  // stitch totether the aggregation for the grid
  let aggregation = [];
  
  if (filterModel.length > 0) {
    aggregation.push(filterMatch);
  }
  
  if (groupKeys.length > 0 ) {
    aggregation.push(match);
  }

  if (rowGroupCols.length > 0 && rowGroupCols.length > groupKeys.length) {
    aggregation = aggregation.concat(context.functions.execute('translateGroupModel', {rowGroupCols, groupKeys, valueCols}));
  } 
  
  aggregation.push(sort);
  
  // paginate the result and get data and total count 
  // of aggregation result. When you provide the total count
  // the infinite scrolling experience will be much more smooth
  aggregation.push({
    $facet: {
      rows: [{$skip: startRow}, {$limit: endRow-startRow}],
      rowCount: [{$count: 'lastRow'}]
    }}, {
    $project: {
      rows: 1,
      lastRow: {$arrayElemAt: ["$rowCount.lastRow", 0]}
    }});
    
  console.log(JSON.stringify(aggregation));
  
  return await collection.aggregate(aggregation).next();
};


/*
Testdata
========
const sortModel=[
  {
    "sort": "DESC",
    "colId": "gold"
  }
]

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

exports({
  startRow: 0,
  endRow: 3,
  sortModel,
  rowGroupCols,
  groupKeys,
  valueCols
})

*/