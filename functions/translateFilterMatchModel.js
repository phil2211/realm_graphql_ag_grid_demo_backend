exports = function({filterModel}) {
  let match = {};
  filterModel.forEach((element) => {
    match = Object.assign({}, match, {[element.filterField]: {"$in": element.values}});
  });
  
  return {"$match": match};
};

/*
TESTDATA
========
const filterModel = [
  {
    "filterField": "country",
    "values": [
      "Afghanistan",
      "Algeria",
      "Argentina"
    ]
  }
]


exports({filterModel})
*/