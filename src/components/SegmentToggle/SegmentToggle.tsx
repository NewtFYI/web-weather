import type { ReactNode } from "react";

type SegmentedOption<T extends string> = {
	value: T;
	label: ReactNode;
};

type SegmentedProps<T extends string> = {
	options: SegmentedOption<T>[];
	value: T;
	onChange: (value: T) => void;
	ariaLabel: string;
	className?: string;
};

export function SegmentToggle<T extends string>({ options, value, onChange, ariaLabel, className }: SegmentedProps<T>) {
	return (
		<div
			role="tablist"
			aria-label={ariaLabel}
			className={`flex w-fit gap-0.5 rounded-full border border-glass-line bg-glass p-1 backdrop-blur-sm ${className || ""}`}
		>
			{options.map((o) => (
				<button
					key={value}
					type="button"
					role="tab"
					aria-selected={o.value === value}
					onClick={() => onChange(o.value)}
					className={
						"cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 " +
						(o.value === value ? "bg-linear-135 from-aqua-500 to-purple-500 text-slate-950" : "text-slate-400 hover:text-slate-300")
					}
				>
					{o.label}
				</button>
			))}
		</div>
	);
}
