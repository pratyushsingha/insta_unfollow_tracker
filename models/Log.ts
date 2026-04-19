import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  level: "info" | "warn" | "error";
  message: string;
  meta?: Record<string, any>;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>({
  level: { type: String, enum: ["info", "warn", "error"], required: true },
  message: { type: String, required: true },
  meta: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

LogSchema.index({ level: 1, timestamp: -1 });

export const Log = mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);
