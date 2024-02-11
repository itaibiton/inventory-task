import { ModeToggle } from "@/components/ui/mode-toggle.js";
import { ThemeProvider } from "@/components/ui/theme-provider.js";
import Navigation from "@/features/navigation/Navigation.js";
import Main from "@/features/table/Table.js";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<main className="flex relative min-w-screen min-h-screen bg-background">
				<Navigation />
				<Main />
				<div className="absolute bottom-2 right-2">
					<ModeToggle />
				</div>
			</main>
		</ThemeProvider>
	);
}

export default App;
