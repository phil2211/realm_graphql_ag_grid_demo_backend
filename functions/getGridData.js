exports = async ({ startRow, endRow, sortModel=[], rowGroupCols=[], groupKeys=[] }) => {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("GridDemo").collection("OlympicWinners");
  
  const match = context.functions.execute('translateMatchModel', {rowGroupCols, groupKeys});
  
  const sort = {
    $sort: sortModel.length <= 0 ? {id:1} : context.functions.execute('translateSortModel', sortModel)
  };
  
  // stitch totether the aggregation for the grid
  let aggregation = [];
  
  if (groupKeys.length > 0 ) {
    aggregation.push(match);
  }

  if (rowGroupCols.length > 0) {
    aggregation = aggregation.concat(context.functions.execute('translateGroupModel', rowGroupCols));
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
sortModel=[
  {
    "sort": "DESC",
    "colId": "gold"
  }
]

rowGroupCols=[
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

groupKeys = [
  "United States",
  "Swimming"
]

exports({
  startRow: 0,
  endRow: 3,
  sortModel,
  rowGroupCols,
  groupKeys
})

*/