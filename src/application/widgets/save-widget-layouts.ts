import type { WidgetLayout, WidgetRepository } from "@/domain";

export type LayoutChange = { id: number; layout: WidgetLayout };

/**
 * Caso de uso: persistir novas posições/tamanhos dos widgets.
 * Salva UM POR VEZ: a API mock faz ler-modificar-gravar do banco inteiro,
 * então PATCHes em paralelo sobrescrevem uns aos outros (lost update).
 */
export function makeSaveWidgetLayouts(repository: WidgetRepository) {
  return async function saveWidgetLayouts(changes: LayoutChange[]): Promise<void> {
    for (const { id, layout } of changes) {
      await repository.update(id, { layout });
    }
  };
}
