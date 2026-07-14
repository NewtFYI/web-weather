import type { LoadingStatus } from "../../types/api.ts";

function LoadingRetry({
	status,
	retry: refresh,
	error,
}: {
	status: LoadingStatus;
	error: string | undefined;
	retry: () => void | Promise<void>;
}) {
	return (
		<div className="cx-scene grid min-h-screen place-items-center" data-scene="clear-night">
			{status === "error" ? (
				<div className="flex flex-col items-center gap-4 px-6 text-center">
					<p className="m-0 text-slate-300">Couldn't load weather{error ? ` — ${error}` : ""}.</p>
					<button
						type="button"
						onClick={refresh}
						className="cursor-pointer rounded-full bg-linear-135 from-aqua-500 to-purple-500 px-5 py-2 text-sm font-semibold text-slate-950"
					>
						Try again
					</button>
				</div>
			) : (
				<p className="m-0 animate-pulse text-slate-400">Loading weather…</p>
			)}
		</div>
	);
}

export default LoadingRetry;
