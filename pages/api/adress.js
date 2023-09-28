import { mongooseConect } from "@/lib/mongoose.js"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth].js"
import { Adress } from "@/models/Adress.js"

export default async function handle(req, res) {
  await mongooseConect()
  const { user } = await getServerSession(req, res, authOptions)

  if (req.method === "PUT") {
    const adress = await Adress.findOne({ userEmail: user.email })
    if (adress) {
      res.json(await Adress.findByIdAndUpdate(adress._id, req.body))
    } else {
      res.json(await Adress.create({ userEmail: user.email, ...req.body }))
    }
  }

  if (req.method === "GET") {
    const adress = await Adress.findOne({ userEmail: user.email })
    res.json(adress)
  }
}
