"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,

  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useState } from "react"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  pageSize?: number,
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
  })

  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  function getPages() {
    const pages: (number | "...")[] = []

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    pages.push(0)

    if (currentPage > 3) pages.push("...")

    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 4) pages.push("...")

    pages.push(totalPages - 1)

    return pages
  }

  return (
    <div>
      <div className="overflow-hidden rounded-md flex flex-col min-h-105">
        <Table className="flex-1 table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="pt-4 pb-4 px-6" style={(() => { const w = (header.column.columnDef.meta as any)?.width; return w ? { width: typeof w === "number" ? `${w}px` : w } : undefined; })()}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-(--color-text-tertiary)">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mt-auto border-t bg-card flex justify-between items-center px-6 py-3 text-(--color-text-tertiary) rounded-bl-xl  rounded-br-xl" style={{ borderTopColor: "var(--color-brand-secondary)" }}>
          <div className="text-caption">
            Mostrando {table.getRowModel().rows.length} de {data.length} transações
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer"
            >
              Anterior
            </Button>
            <Pagination>
              <PaginationContent>
                {getPages().map((page, i) => (
                  page === "..." ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
              </PaginationContent>
            </Pagination>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer"
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}