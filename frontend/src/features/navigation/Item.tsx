import { Button } from "@/components/ui/button.js";
import useStore from "@/store/inventory.js";
import React from "react";

function Item({ item }: { item: { name: string; quantity: number } }) {
	const { activeProduct, updateActive } = useStore();

	return (
		<Button
			onClick={() => updateActive(item.name)}
			variant="ghost"
			className={`flex justify-between items-center text-start w-full gap-2 group hover:bg-card-foreground hover:text-white hover:text-card ${
				activeProduct === item.name ? "bg-primary text-white" : ""
			}`}
		>
			{item.name}{" "}
			<span className={`bg-primary px-1 py-0.5 rounded text-xs  text-white`}>
				{item.quantity}
			</span>
		</Button>
	);
}

export default Item;
