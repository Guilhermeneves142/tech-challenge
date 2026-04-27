import Link from "next/link"
import type { LucideIcon } from "lucide-react"

type Props = {
	text: string,
	icon: LucideIcon,
	className?: string,
	route: string,
	locked?: boolean,
}

export default function ActionButton({text, icon: Icon, className, route, locked}: Props) {
	const inner = (
		<>
			<span className="bg-brand-secondary text-brand-primary p-3 rounded-full flex items-center justify-center">
				<Icon size={24} />
			</span>
			<span className="text-[18px] font-medium pt-2">{text}</span>
		</>
	)

	if (locked) {
		return (
			<div className={["bg-white py-6 flex flex-col justify-center items-center shadow relative overflow-hidden rounded-sm grayscale opacity-60 cursor-not-allowed", className].join(" ")}>
				{inner}
			</div>
		)
	}

	return (
		<Link
			href={route}
			className={["bg-white py-6 flex flex-col justify-center items-center shadow cursor-pointer hover:bg-gray-100", className].join(" ")}>
			{inner}
		</Link>
	)
}
