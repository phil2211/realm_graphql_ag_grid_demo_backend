exports = async ({ startRow, endRow, sortModel, groups, groupKeys }) => {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("GridDemo").collection("OlympicWinners");
  const query = {}
  const sort = sortModel.length <= 0 ? {_id:1} : context.functions.execute('translateSortModel', sortModel);
  const lastRow = await collection.count(query);
  const rows = await collection.find(query).sort(sort).skip(startRow).limit(endRow-startRow).toArray();
  
  return {
    //lastRow: lastRow,
    rows: rows
  };

};