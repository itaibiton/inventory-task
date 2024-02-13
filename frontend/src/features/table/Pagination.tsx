import { Button } from "@/components/ui/button.js";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.js";
import { TableProps } from "@/features/table/types.js";
import useStore from "@/store/inventory.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface PaginationProps {
	tableData: TableProps;
	setTableData: React.Dispatch<React.SetStateAction<TableProps>>;
}

function Pagination({ tableData, setTableData }: PaginationProps) {
	const { total, updateProducts } = useStore();

	const handleNext = () => {
		const newSkip = tableData.skip + tableData.take;
		if (newSkip < total) {
			// Ensure we do not skip past the total number of items
			setTableData((prev) => ({
				...prev,
				skip: newSkip,
			}));
		}
	};

	const handlePrev = () => {
		const newSkip = tableData.skip - tableData.take;
		if (newSkip >= 0) {
			// Ensure we do not skip before the start
			setTableData((prev) => ({
				...prev,
				skip: newSkip,
			}));
		}
	};

	const handleLimitChange = (e: number | string) => {
		setTableData((prev) => ({ ...prev, take: Number(e), skip: 0 }));
	};

	const currentPage = Math.floor(tableData.skip / tableData.take) + 1;
	const totalPages = Math.ceil(total / tableData.take);

	return (
		<div className="border rounded p-2 flex items-center justify-between">
			<div className="flex items-center gap-2">
				<Button
					size="icon"
					variant="ghost"
					onClick={handlePrev}
					disabled={tableData.skip === 0}
					className="p-1 disabled:opacity-50"
				>
					<ChevronLeft onClick={handlePrev} />
				</Button>
				{currentPage}
				<Button
					size="icon"
					variant="ghost"
					onClick={handleNext}
					disabled={tableData.skip + tableData.take >= total}
					className="p-1 disabled:opacity-50"
				>
					<ChevronRight onClick={handleNext} />
				</Button>
				<Select
					onValueChange={handleLimitChange}
					value={tableData.take.toString()}
				>
					<SelectTrigger className="w-[60px]">
						<SelectValue placeholder="Theme" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="3">3</SelectItem>
						<SelectItem value="5">5</SelectItem>
						<SelectItem value="10">10</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>Total items: {total}</div>
		</div>
	);
}

export default Pagination;
