import { model, Schema } from "mongoose";
const DistrictsSchema = new Schema({
  name: {
    type: String,
  },
});
export const DistrictsModel = model("districts", DistrictsSchema);
