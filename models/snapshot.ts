import mongoose, { Schema, Document } from "mongoose";

export interface ISnapshot extends Document {
  userId: mongoose.Types.ObjectId;
  followersEncrypted: string;
  takenAt: Date;
}

const SnapshotSchema = new Schema<ISnapshot>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  followersEncrypted: { type: String, required: true },
  takenAt: { type: Date, default: Date.now },
});
SnapshotSchema.index({ userId: 1, takenAt: -1 });

export const Snapshot =
  mongoose.models.Snapshot ||
  mongoose.model<ISnapshot>("Snapshot", SnapshotSchema);
