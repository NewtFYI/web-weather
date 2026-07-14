import { useCombobox } from "downshift";
import { CornerDownLeft, Search } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { searchCity } from "../../api/client.ts";
import type { WeatherCity } from "../../types/weather.ts";
import Separator from "../Separator/Separator.tsx";

function highlightMatch(name: string, search: string): ReactNode {
	const needle = search.trim().toLowerCase();
	const needleIndex = needle ? name.toLowerCase().indexOf(needle) : -1;
	if (needleIndex < 0) return name;
	return (
		<>
			{name.slice(0, needleIndex)}
			<span className="text-aqua-300">{name.slice(needleIndex, needleIndex + needle.length)}</span>
			{name.slice(needleIndex + needle.length)}
		</>
	);
}

export function CitySearch({ onSelect }: { onSelect: (city: WeatherCity) => void }) {
	const [items, setItems] = useState<WeatherCity[]>([]);
	const [inputValue, setInputValue] = useState("");

	// Debounce search with standard timeout, instead of using something like ReactQuery
	useEffect(() => {
		const searchValue = inputValue.trim();
		if (searchValue.length < 2) {
			setItems([]);
			return;
		}
		const t = setTimeout(() => {
			searchCity({
				queryParams: {
					q: searchValue,
				},
			})
				.then(setItems)
				.catch(() => {
					// keep previous items if api fails
				});
		}, 300);
		return () => {
			clearTimeout(t);
		};
	}, [inputValue]);

	const comboBox = useCombobox<WeatherCity>({
		items,
		inputValue,
		defaultHighlightedIndex: 0,
		itemToString: (item) => item?.name ?? "",
		onInputValueChange: ({ inputValue: v }) => setInputValue(v ?? ""),
		onSelectedItemChange: ({ selectedItem }) => {
			if (selectedItem) {
				onSelect(selectedItem);
				setInputValue("");
				setItems([]);
			}
		},
	});

	const open = comboBox.isOpen && items.length > 0;

	return (
		<div className="relative mt-2 w-80 max-w-full">
			<div
				className={
					"flex items-center gap-2 rounded-full border px-3 py-2 text-sm backdrop-blur-sm transition-colors duration-200 " +
					(open ? "border-aqua-400/40 bg-slate-950/60 shadow-glow-aqua" : "border-glass-line bg-glass-soft")
				}
			>
				<Search size={16} className="shrink-0 text-slate-400" />
				<input
					{...comboBox.getInputProps({ placeholder: "Search city", "aria-label": "Search city" })}
					className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-400"
				/>
			</div>
			<ul
				{...comboBox.getMenuProps()}
				className={
					"absolute inset-x-0 top-[calc(100%+8px)] z-10 m-0 list-none flex-col gap-0.5 rounded-xl border border-glass-line-strong bg-slate-900/90 p-1 shadow-lg backdrop-blur-xl " +
					(open ? "flex" : "hidden")
				}
			>
				{open &&
					items.map((item, index) => (
						<li
							key={item.url}
							{...comboBox.getItemProps({ item, index })}
							className={
								"flex min-h-8 cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 " +
								(comboBox.highlightedIndex === index ? "border-aqua-400/35 bg-aqua-500/15" : "border-transparent")
							}
						>
							<span className="flex flex-col">
								<span className="truncate text-sm font-semibold text-slate-100">{highlightMatch(item.name, inputValue)}</span>
								<span className="truncate text-xs text-slate-400">
									{item.region}
									<Separator />
									{item.country}
								</span>
							</span>
							{comboBox.highlightedIndex === index && (
								<span className="ml-auto text-aqua-300">
									<CornerDownLeft size={12} />
								</span>
							)}
						</li>
					))}
			</ul>
		</div>
	);
}
