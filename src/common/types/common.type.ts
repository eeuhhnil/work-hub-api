import mongoose from "mongoose"

export type IdLike<T> = mongoose.Schema.Types.ObjectId | string | number | T