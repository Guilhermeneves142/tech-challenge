import type { WidgetRepository } from "@/domain";
import { api } from "@/infra/http/finance-api";

export const httpWidgetRepository: WidgetRepository = {
  list: () => api.getDashboardWidgets(),
  create: (data) => api.createDashboardWidget(data),
  update: (id, data) => api.updateDashboardWidget(id, data),
  remove: (id) => api.deleteDashboardWidget(id),
};
