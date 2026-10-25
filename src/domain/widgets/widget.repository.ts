import type { DashboardWidget, NewDashboardWidget } from "./widget.entity";

export interface WidgetRepository {
  list(): Promise<DashboardWidget[]>;
  create(data: NewDashboardWidget): Promise<DashboardWidget>;
  update(id: number, data: Partial<NewDashboardWidget>): Promise<DashboardWidget>;
  remove(id: number): Promise<void>;
}
