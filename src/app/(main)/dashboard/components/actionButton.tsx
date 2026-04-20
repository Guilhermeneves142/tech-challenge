import Link from "next/link"

type Props = {
	text: string,
	icon: string,
	className?: string,
	route: string
}

export default function ActionButton({text, icon, className, route}: Props) {
	return (
		<Link 
			href={route}
			className={["bg-white py-6 flex flex-col justify-center items-center shadow cursor-pointer hover:bg-gray-100",className].join(" ")}>
			<span className="material-symbols-outlined bg-brand-secondary text-brand-primary p-3 rounded-full">
				{icon}
			</span>
			<span className="text-[18px] font-medium pt-2">{text}</span>
		</Link>
	)
}