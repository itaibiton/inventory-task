import useStore from "@/store/inventory.js";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

function Main() {
	const { activeProduct, updateProducts, loading } = useStore();

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

	return (
		<div className="p-4 w-full">
			{loading.products ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				<table>
					<thead></thead>
					<tbody></tbody>
				</table>
			)}
		</div>
	);
}

export default Main;
