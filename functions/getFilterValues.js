exports = ({ queryInput }) => {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("GridDemo").collection("OlympicWinners");
  
  const sortModel = [
    {
      colId: queryInput,
      sort: "ASC"
    }
  ]

  const sort = {
    $sort: context.functions.execute('translateSortModel', sortModel)
  };

  console.log(sort);

  return {filterValues: ["Australia", "China", "Sweden"]};
};
