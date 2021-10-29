exports = async ({ startRow, endRow, sortModel=[], rowGroupCols=[], groupKeys }) => {
  console.log(JSON.stringify(rowGroupCols));
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("GridDemo").collection("OlympicWinners");
  
  const match = {};
  
  const sort = {
    $sort: sortModel.length <= 0 ? {_id:1} : context.functions.execute('translateSortModel', sortModel)
  };
  
  // stitch totether the aggregation for the grid
  let aggregation = [];
  
  aggregation = rowGroupCols.length <= 0 ? 
    null : 
    aggregation.concat(context.functions.execute('translateGroupModel', rowGroupCols));
  
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
    
  console.log(JSON.stringify(aggregation, null, 2));
  
  return await collection.aggregate(aggregation).next();
};