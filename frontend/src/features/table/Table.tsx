import { Separator } from "@/components/ui/separator.js";
import { getUniqueColumns } from "@/lib/utils.js";
import useStore, { Product } from "@/store/inventory.js";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

function Main() {
	const { activeProduct, updateProducts, loading, products } = useStore();

	const createQueryString = (
		name: string,
		skip: number,
		take: number,
		filter: string
	) =>
		`${
			activeProduct
				? `name=${name}&skip=${skip}&take=${take}${filter ? `&${filter}}` : ""}`
				: ""
		}`;

	const [table, setTable] = useState({
		skip: 0,
		take: 5,
		filter: createQueryString(activeProduct, 0, 0, ""),
	});

	useEffect(() => {
		if (activeProduct !== "") {
			setTable((prev) => ({
				...prev,
				filter: createQueryString(activeProduct, prev.skip, prev.take, ""),
			}));
		}
	}, [activeProduct]);

	useEffect(() => {
		if (table.filter) {
			updateProducts(table.filter);
		}
	}, [table.filter]);

	const columns = products.length > 0 ? getUniqueColumns(products) : [];

	return (
		<div className="p-4  w-full">
			{loading.products ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				<div className="flex flex-col w-full">
					<p className="text-xl">{activeProduct}</p>
					<Separator className="my-2 w-full" />
					<table className=" border-red-500">
						<thead>
							<tr>
								{columns.map((column) => (
									<th className="text-start" key={column}>
										{column.toUpperCase()}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{products.map((product) => (
								<tr key={product.id} className="hover:bg-secondary">
									{columns.map((column) => {
										// Handle rendering of product attributes safely
										let content: React.ReactNode;
										if (column in product) {
											// Directly accessing known scalar properties of Product
											content =
												product[column as keyof Omit<Product, "attributes">];
										} else if (
											product.attributes &&
											column in product.attributes
										) {
											// Accessing nested attributes if they exist
											content = product.attributes[column];
										} else {
											// Fallback for undefined properties
											content = null;
										}

										return <td key={`${product.id}-${column}`}>{content}</td>;
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default Main;
