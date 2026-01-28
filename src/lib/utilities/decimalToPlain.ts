// src/lib/utilities/decimalToPlain.ts
export function decimalToPlain(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  // ✅ catch Prisma Decimal by its methods
  if (typeof obj === "object" && obj?.toNumber instanceof Function) {
    return obj.toNumber();
  }

  if (Array.isArray(obj)) {
    return obj.map(decimalToPlain);
  }

  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, decimalToPlain(value)])
    );
  }

  return obj;
}
