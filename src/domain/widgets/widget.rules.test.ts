import { describe, expect, it } from "vitest";
import { applyLayouts, changedLayouts, nextWidgetLayout, normalizeWidgetConfig, type DashboardWidget } from "@/domain";

const widget = (id: number, y: number, h: number): DashboardWidget => ({
  id,
  title: `w${id}`,
  chartType: "bar",
  metric: "income",
  dimension: "month",
  layout: { x: 0, y, w: 6, h },
});

describe("normalizeWidgetConfig", () => {
  it("pizza não aceita saldo → cai na primeira métrica válida", () => {
    const cfg = normalizeWidgetConfig({ title: "x", chartType: "pie", metric: "balance", dimension: "month" });
    expect(cfg.metric).toBe("expense");
    expect(cfg.dimension).toBe("category");
  });

  it("comparação não usa dimensão 'type'", () => {
    const cfg = normalizeWidgetConfig({ title: "x", chartType: "bar", metric: "comparison", dimension: "type" });
    expect(cfg.dimension).toBe("month");
  });
});

describe("nextWidgetLayout", () => {
  it("posiciona abaixo do último widget", () => {
    expect(nextWidgetLayout([widget(1, 0, 8), widget(2, 8, 3)], "kpi")).toEqual({ x: 0, y: 11, w: 4, h: 3 });
  });
});

describe("changedLayouts", () => {
  it("retorna só os que mudaram", () => {
    const list = [widget(1, 0, 8), widget(2, 8, 3)];
    const next = [
      { id: 1, layout: { x: 0, y: 0, w: 6, h: 8 } },
      { id: 2, layout: { x: 6, y: 0, w: 6, h: 3 } },
    ];
    expect(changedLayouts(list, next).map((c) => c.id)).toEqual([2]);
  });
});

describe("applyLayouts", () => {
  it("troca só o layout dos widgets alterados", () => {
    const list = [widget(1, 0, 8), widget(2, 8, 3)];
    const out = applyLayouts(list, [{ id: 2, layout: { x: 6, y: 0, w: 6, h: 3 } }]);
    expect(out[0]).toBe(list[0]);
    expect(out[1].layout).toEqual({ x: 6, y: 0, w: 6, h: 3 });
  });
});
