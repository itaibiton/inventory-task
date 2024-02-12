import { Button } from "@/components/ui/button.js";
import { Checkbox } from "@/components/ui/checkbox.js";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.js";
import { Separator } from "@/components/ui/separator.js";
import Pagination from "@/features/table/Pagination.js";
import { TableColumn, TableProps } from "@/features/table/types.js";
import useStore, { Product } from "@/store/inventory.js";
import { ChevronDown, ChevronUp, Filter, Loader2, Minus } from "lucide-react";
import React, { useEffect, useState } from "react";

const getDynamicColumns = (products: Product[]): TableColumn[] => {
	// Define custom formatters
	const customFormatters: Record<string, (val: any) => React.ReactNode> = {
		price: (val: number) => `$${val.toFixed(2)}`,
		color: (val: string) => (
			<div
				className={`px-2 py-1 rounded min-w-full`}
				style={{ background: val }}
			>
				{val}
			</div>
		),
	};

	// Start with common columns
	let baseColumns: TableColumn[] = [
		{ key: "name", header: "Name" },
		{ key: "description", header: "Description" },
		{ key: "price", header: "Price", formatter: customFormatters["price"] },
	];

	// Collect all unique attribute keys across products
	const attributeKeys = new Set<string>();
	products.forEach((product) => {
		Object.keys(product.attributes || {}).forEach((attrKey) => {
			attributeKeys.add(attrKey);
		});
	});

	// Add columns for attributes with custom formatters if they exist in any product
	attributeKeys.forEach((key) => {
		if (customFormatters[key]) {
			baseColumns.push({
				key,
				header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
				formatter: customFormatters[key],
			});
		} else {
			// For attributes without custom formatters
			baseColumns.push({
				key,
				header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
			});
		}
	});

	return baseColumns;
};

function Main() {
	const {
		activeProduct,
		updateProducts,
		loading,
		products,
		error,
		distinctValues,
		updateDistinctValues,
	} = useStore();

	const createQueryString = (
		name: string,
		skip: number,
		take: number,
		sort: string,
		sortDir: "asc" | "desc" | "",
		filter: string
	) => {
		let queryString = `${
			activeProduct ? `name=${name}&skip=${skip}&take=${take}` : ""
		}`;

		if (sort && sortDir) {
			queryString += `&sort=${sort}:${sortDir}`;
		}

		if (filter) {
			queryString += `&${filter}`;
		}

		return queryString;
	};

	const [tableData, setTableData] = useState<TableProps>({
		skip: 0,
		take: 3,
		filter: createQueryString(activeProduct, 0, 0, "", "", ""),
		sort: "",
		sortDir: "",
		clickedCount: 0,
	});

	const handleSort = (header: string) => {
		// If the sort direction is already ascending for this column
		if (
			tableData.sort === header.toLowerCase() &&
			tableData.sortDir === "asc"
		) {
			// Change to descending order
			setTableData((prev) => ({
				...prev,
				sortDir: "desc",
			}));
		} else if (
			tableData.sort === header.toLowerCase() &&
			tableData.sortDir === "desc"
		) {
			// Reset sorting
			setTableData((prev) => ({
				...prev,
				sort: "",
				sortDir: "",
				clickedCount: 0,
			}));
		} else {
			// Change to ascending order
			setTableData((prev) => ({
				...prev,
				sort: header.toLowerCase(),
				sortDir: "asc",
				clickedCount: (prev.clickedCount || 0) + 1,
			}));
		}
	};

	const handleCheckbox = (e: any, header: string, val: string | number) => {
		const isChecked = e;
		let updatedFilter = tableData.filter || "";

		// Check if the value is already present in the filter
		const filterParam = `&${header.toLowerCase()}=${val}`;

		if (isChecked) {
			// Add the value to the filter if it's not already present
			if (!updatedFilter.includes(filterParam)) {
				updatedFilter += filterParam;
			}
		} else {
			// Remove the value from the filter if it's present
			updatedFilter = updatedFilter.replace(filterParam, "");
		}

		// Update the tableData state with the new filter
		setTableData((prev) => ({
			...prev,
			filter: updatedFilter,
		}));
	};

	useEffect(() => {
		if (activeProduct) {
			updateDistinctValues(activeProduct);
		}
	}, [activeProduct]);

	useEffect(() => {
		if (activeProduct !== "") {
			setTableData((prev) => ({
				...prev,
				filter: createQueryString(
					activeProduct,
					prev.skip,
					prev.take,
					tableData.sort,
					tableData.sortDir,
					""
				),
			}));
		}
	}, [
		activeProduct,
		tableData.skip,
		tableData.take,
		tableData.sort,
		tableData.sortDir,
	]);

	useEffect(() => {
		if (
			tableData.filter &&
			activeProduct.toLowerCase() === distinctValues.productName.toLowerCase()
		) {
			console.log("active product", activeProduct);
			console.log("disctincst product", distinctValues);
			updateProducts(tableData.filter);
		}
	}, [tableData.filter, distinctValues.productName]);

	const columns: TableColumn[] = getDynamicColumns(products); // Assuming this function is already adjusted

	if (error) return <>Error loading data</>;

	return (
		<div className="p-4  w-full overflow-x-auto">
			{loading.products ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				<div className="flex flex-col w-full min-w-fit overflow-x-auto">
					<p className="text-xl">{activeProduct}</p>
					<Separator className="my-2 w-full" />
					<table className="border-separate w-full">
						<thead>
							<tr>
								{columns &&
									columns.length > 0 &&
									columns.map((column) => (
										<th
											className="text-start min-w-[120px] px-2 whitespace-nowrap cursor-pointer"
											key={column.key} // Use column.key for the key prop
										>
											<div className="flex flex-row items-center">
												<Button
													variant="ghost"
													className="flex text-start gap-1 p-0 h-fit"
													onClick={() => handleSort(column.header)}
												>
													<>
														{column.header.toUpperCase()}
														{column.header.toLowerCase() ===
														tableData.sort.toLowerCase() ? (
															<>
																{tableData.sortDir === "asc" ? (
																	<ChevronUp />
																) : (
																	<ChevronDown />
																)}
															</>
														) : (
															<Minus className="opacity-0" />
														)}
													</>
												</Button>
												<Popover>
													<PopoverTrigger>
														<Filter className="h-4 w-4" />
													</PopoverTrigger>
													<PopoverContent>
														{distinctValues.distinctValues &&
															distinctValues.distinctValues[
																column.header.toLowerCase()
															] &&
															distinctValues?.distinctValues[
																column.header.toLowerCase()
															].length > 0 &&
															distinctValues.distinctValues[
																column.header.toLowerCase()
															].map((val: string | number, index) => (
																<div
																	className="flex justify-between"
																	key={`${index}_${val}`}
																>
																	{val}
																	<Checkbox
																		onCheckedChange={(e) =>
																			// handleCheckbox(column.header, val)
																			handleCheckbox(e, column.header, val)
																		}
																		checked={tableData.filter.includes(
																			`${column.header.toLowerCase()}=${val}`
																		)}
																		className="rounded"
																	/>
																</div>
															))}
													</PopoverContent>
												</Popover>
											</div>
										</th>
									))}
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product.id} className="hover:bg-secondary">
									{columns.map((column) => {
										// Determine the cell's content
										const rawValue =
											column.key in product
												? product[
														column.key as keyof Omit<Product, "attributes">
												  ]
												: product.attributes?.[column.key];
										const content = column.formatter
											? column.formatter(rawValue, product)
											: rawValue;

										return (
											<td
												className="min-w-fit px-2 whitespace-nowrap"
												key={`${product.id}-${column.key}`} // Use column.key for the key prop
											>
												{content}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>

					<Pagination tableData={tableData} setTableData={setTableData} />
				</div>
			)}
		</div>
	);
}

export default Main;
