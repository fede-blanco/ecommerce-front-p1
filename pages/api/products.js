import { mongooseConect } from "@/lib/mongoose.js"
import { Product } from "@/models/Product.js"

export default async function handle(req, res) {
  await mongooseConect()
  const { categories, sort, phrase, ...filters } = req.query
  const page = req.query.page
  if (req.query.page) {
    const response = await Product.paginate(
      {},
      {
        limit: 12,
        page,
        lean: true,
      }
    )
    res.json(
      response
    )
  } else {
  const [sortField, sortOrder] = (sort || "_id-desc").split("-")
  const productsQuery = {}
  if (categories) {
    productsQuery.category = categories.split(",")
  }
  if (phrase) {
    productsQuery["$or"] = [
      { title: { $regex: phrase, $options: "i" } },
      { description: { $regex: phrase, $options: "i" } },
    ]
  }
  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach((filterName) => {
      // Por cada nombre en "filters" se agrega una propiedad al objeto "productsQuery" con un formato especial para poder utilizar en una búsqueda de mongo db que no restrinja a que tenga que tener todas las propiedades del objeto sino que que el objeto tenga al menos esta propiedad que se esté pasando y se le da el valor que tenga esa propiuedad en "filters"
      productsQuery["properties." + filterName] = filters[filterName]
      // si se manda una prop en especial si se crea la propiedad en el objeto y bloquea los productos que no tengan la misma propiedad pero sino no la crea
    })
  }
  res.json(
    await Product.find(productsQuery, null, {
      sort: { [sortField]: sortOrder === "asc" ? 1 : -1 },
    })
  )
  }
}
