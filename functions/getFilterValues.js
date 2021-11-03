exports = async ({ queryInput }) => {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("GridDemo").collection("OlympicWinners");
  
  console.log(JSON.stringify(queryInput));
  
  const aggregation = [
    {$group: {
      _id: `$${queryInput}`   
    }},
    {$sort:{
      _id: 1
    }}
  ];
  
  const result = await collection.aggregate(aggregation).toArray();
  return {filterValues: result.map(entry => entry._id)};
};
