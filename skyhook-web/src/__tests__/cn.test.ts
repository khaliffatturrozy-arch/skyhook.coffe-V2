import { describe, it, expect } from "vitest"
import { cn } from "@/utils/cn"

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  it("resolves tailwind conflicts", () => {
    expect(cn("px-4", "px-2")).toBe("px-2")
  })

  it("handles empty input", () => {
    expect(cn()).toBe("")
  })

  it("handles undefined values", () => {
    expect(cn("a", undefined, "b")).toBe("a b")
  })
})
