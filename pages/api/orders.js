import { mongooseConect } from "@/lib/mongoose.js"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth].js"
import { Orders } from "@/models/Order.js"

export default async function handle(req, res) {
  await mongooseConect()

  const session = await getServerSession(req, res, authOptions)
  const user = session?.user
  const page = req.query.page

  if(req.query.page) {
    const response = await Orders.paginate(
      { userEmail: user?.email, paid: true },
      {
        limit: 2,
        page,
        lean: true,
      }
      )
    res.json(response)
  } else {
    const orders = await Orders.find({ userEmail: user?.email })
    res.json(orders)
  }
}
