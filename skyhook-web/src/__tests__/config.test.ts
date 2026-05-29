import { describe, it, expect } from "vitest"
import { SKYHOOK_CONFIG, ROUTES } from "@/config"

describe("SKYHOOK_CONFIG", () => {
  it("has required top-level fields", () => {
    expect(SKYHOOK_CONFIG.name).toBe("Skyhook Coffee")
    expect(SKYHOOK_CONFIG.membership.tiers).toHaveLength(6)
    expect(SKYHOOK_CONFIG.outlets.cities).toContain("Jakarta")
  })

  it("has all membership tiers", () => {
    const names = SKYHOOK_CONFIG.membership.tiers.map((t) => t.name)
    expect(names).toContain("Skyhook Royalty")
    expect(names).toContain("VIP Elite")
    expect(names).toContain("Member")
  })

  it("tiers are ordered by minPoints descending", () => {
    const points = SKYHOOK_CONFIG.membership.tiers.map((t) => t.minPoints)
    for (let i = 1; i < points.length; i++) {
      expect(points[i - 1]).toBeGreaterThan(points[i])
    }
  })
})

describe("ROUTES", () => {
  it("has all admin routes", () => {
    const adminKeys = Object.keys(ROUTES.admin)
    expect(adminKeys).toContain("dashboard")
    expect(adminKeys).toContain("orders")
    expect(adminKeys).toContain("menu")
    expect(adminKeys).toContain("analytics")
    expect(adminKeys).toContain("payments")
    expect(adminKeys).toContain("customers")
  })

  it("has all public routes", () => {
    expect(ROUTES.menu).toBe("/menu")
    expect(ROUTES.events).toBe("/events")
    expect(ROUTES.wallet).toBe("/wallet")
    expect(ROUTES.kds).toBe("/kds")
    expect(ROUTES.pos).toBe("/pos")
  })
})
