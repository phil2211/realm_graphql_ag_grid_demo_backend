exports = async ({ startRow, endRow, sortModel=[], groups, groupKeys }) => {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("GridDemo").collection("OlympicWinners");
  
  const match = {};
  
  const group = {};
  
  const sort = {
    $sort: sortModel.length <= 0 ? {_id:1} : context.functions.execute('translateSortModel', sortModel)
  };
  
  const skip = {
    $skip: startRow
  };
  
  const limit = {
    $limit: endRow-startRow
  };
  
  const aggregation = [];
  aggregation.push(sort);
  startRow >0 ? aggregation.push(skip): null;
  aggregation.push(limit);
  
  console.log(JSON.stringify(aggregation));
  
  // const lastRow = await collection.count(query);
  const rows = await collection.aggregate(aggregation).toArray();
  
  return {
    //lastRow: lastRow,
    rows: rows
  };

};