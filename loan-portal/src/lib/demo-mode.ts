export function isDemoModeEnabled(): boolean {
  if (process.env.DEMO_MODE) {
    return process.env.DEMO_MODE === "true";
  }

  return process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL;
}
