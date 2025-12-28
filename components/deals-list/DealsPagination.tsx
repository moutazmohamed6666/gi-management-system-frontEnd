import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DealsPaginationProps {
  total: number;
  page: number;
  pageSize: number;
  dealsLength: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DealsPagination({
  total,
  page,
  pageSize,
  dealsLength,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: DealsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages && dealsLength === pageSize;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {total > 0 ? (
          <>
            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {(page - 1) * pageSize + Math.min(dealsLength, 1)}
            </span>
            {" - "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {(page - 1) * pageSize + dealsLength}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {total}
            </span>
          </>
        ) : (
          "Showing 0 results"
        )}
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={String(pageSize)}
          onValueChange={(v) => onPageSizeChange(Number(v))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!canPrev || isLoading}
        >
          Prev
        </Button>
        <div className="text-sm text-gray-700 dark:text-gray-300 px-2">
          Page <span className="font-medium">{page}</span> /{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={!canNext || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

