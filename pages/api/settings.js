import { mongooseConect } from "@/lib/mongoose.js";
import { Setting } from "@/models/Setting.js";


export default async function handle(req,res) {

  await mongooseConect();

  if (req.method === "GET"){
    const {name} = req.query;
    const settingRequired = await Setting.findOne({name})
    res.json(settingRequired)
  }
}

