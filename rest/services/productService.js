const Product = require('../models/Product');

const getAll = async (req) => {
  const { search, featured, company, fields, numericFields, sort } = req.query;

  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (search) {
    queryObject.name = { $regex: search, $options: 'i' };
    queryObject.description = { $regex: search, $options: 'i' };
  }
  if (numericFields) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
      '=': '$eq',
    };
    const regEx = /\b(<|>|>=|<=|=)\b/g;
    let filters = numericFields.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: +value };
      }
    });
  }

  let results = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(',').join(' ');
    results = results.sort(sortList);
  } else {
    results = results.sort('createdAt');
  }

  if (fields) {
    const fieldList = fields.split(',').join(' ');
    results = results.select(fieldList);
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  results = results.skip(skip).limit(limit);

  const products = await results;
  const total = await Product.countDocuments(queryObject);
  return {
    page,
    pages: Math.ceil(total / limit),
    total,
    products,
  };
};

const getById = async (id) => {
  const product = await Product.findById(id);
  return product;
};

const create = async (item) => {
  const product = await Product.create(item);
  return product;
};

const update = async (_id, item) => {
  const product = await Product.findByIdAndUpdate({ _id }, item, {
    runValidators: true,
    new: true,
  });
  return product;
};

const deleteAll = async () => {
  await Product.deleteMany();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  deleteAll,
};
