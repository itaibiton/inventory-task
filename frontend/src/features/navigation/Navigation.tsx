import Item from "@/features/navigation/Item.js";
import useStore from "@/store/inventory.js";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function Navigation() {
	const { updateItems, items, loading } = useStore();

	useEffect(() => {
		if (items.length === 0) {
			updateItems();
		}
	}, [items]);

	return (
		<nav className="bg-secondary drop-shadow-lg min-w-fit w-60 p-4">
			{loading.items ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				<ul className="flex gap-2 flex-col w-full">
					{items &&
						items.length > 0 &&
						items.map((item) => <Item item={item} key={item.name} />)}
				</ul>
			)}
		</nav>
	);
}

export default Navigation;
