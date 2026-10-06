import { describe, expect, it } from "vitest";
import { backupSchema, settingsSchema } from "../schemas";
import { defaultProfile } from "../lib/db";

describe("runtime validation", () => {
  it("accepts safe application settings", () => {
    expect(settingsSchema.safeParse(defaultProfile.settings).success).toBe(true);
  });

  it("rejects malformed imports without coercion", () => {
    expect(backupSchema.safeParse({ version: 1, profile: {}, progress: "lost" }).success).toBe(
      false
    );
    expect(settingsSchema.safeParse({ ...defaultProfile.settings, dailyTarget: 999 }).success).toBe(
      false
    );
  });
});
