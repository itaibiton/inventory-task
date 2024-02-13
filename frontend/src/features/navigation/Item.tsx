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
			<span
				className={`bg-primary w-6 h-6 min-w-fit p-1 flex items-center justify-center rounded text-xs ${
					activeProduct === item.name ? "bg-white text-primary" : "text-white"
				}`}
			>
				{item.quantity}
			</span>
		</Button>
	);
}

export default Item;
