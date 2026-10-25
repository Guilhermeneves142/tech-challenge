import {
  nextWidgetLayout,
  normalizeWidgetConfig,
  validateWidgetConfig,
  type DashboardWidget,
  type WidgetConfig,
  type WidgetRepository,
} from "@/domain";

export class WidgetValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WidgetValidationError";
  }
}

export interface SaveWidgetInput {
  config: WidgetConfig;
  /** Widgets atuais — usados para posicionar o novo no fim da grid. */
  current: DashboardWidget[];
  /** Presente → edição. */
  id?: number;
}

/** Caso de uso: criar ou editar um widget do dashboard. */
export function makeSaveWidget(repository: WidgetRepository) {
  return async function saveWidget({ config, current, id }: SaveWidgetInput): Promise<DashboardWidget> {
    const error = validateWidgetConfig(config);
    if (error) throw new WidgetValidationError(error);

    const normalized = normalizeWidgetConfig({ ...config, title: config.title.trim() });
    if (id) return repository.update(id, normalized);

    return repository.create({
      ...normalized,
      layout: nextWidgetLayout(current, normalized.chartType),
    });
  };
}
