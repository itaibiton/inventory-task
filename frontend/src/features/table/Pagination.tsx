import { TableProps } from "@/features/table/types.js";
import useStore from "@/store/inventory.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect } from "react";

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

	const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setTableData((prev) => ({ ...prev, take: Number(e?.target?.value) }));
	};

	const currentPage = Math.floor(tableData.skip / tableData.take) + 1;
	const totalPages = Math.ceil(total / tableData.take);

	return (
		<div className="border rounded p-2 flex items-center justify-between">
			<div className="flex items-center">
				<button
					onClick={handlePrev}
					disabled={tableData.skip === 0}
					className="p-1 disabled:opacity-50"
				>
					<ChevronLeft onClick={handlePrev} />
				</button>
				{currentPage}
				<button
					onClick={handleNext}
					disabled={tableData.skip + tableData.take >= total}
					className="p-1 disabled:opacity-50"
				>
					<ChevronRight onClick={handleNext} />
				</button>
				<select onChange={handleLimitChange} value={tableData.take}>
					<option value={3}>3</option>
					<option value={5}>5</option>
					<option value={10}>10</option>
				</select>
			</div>
			<div>Total items: {total}</div>
		</div>
	);
}

export default Pagination;
