import { describe, expect, it } from "vitest";
import type { WidgetRepository } from "@/domain";
import { makeSaveWidgetLayouts } from "./save-widget-layouts";

describe("saveWidgetLayouts", () => {
  it("salva em sequência, nunca em paralelo", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const order: number[] = [];
    const repo = {
      update: async (id: number) => {
        inFlight++;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await new Promise((r) => setTimeout(r, 5));
        order.push(id);
        inFlight--;
        return {} as never;
      },
    } as unknown as WidgetRepository;

    await makeSaveWidgetLayouts(repo)([
      { id: 1, layout: { x: 0, y: 0, w: 6, h: 8 } },
      { id: 2, layout: { x: 6, y: 0, w: 6, h: 8 } },
      { id: 3, layout: { x: 0, y: 8, w: 4, h: 3 } },
    ]);

    expect(maxInFlight).toBe(1);
    expect(order).toEqual([1, 2, 3]);
  });
});
