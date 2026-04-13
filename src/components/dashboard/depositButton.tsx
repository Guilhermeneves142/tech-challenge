type Props = {
	text: string,
	icon: string,
	className: string
}

export default function DepositButton({text, icon, className}: Props) {
	return (
		<button className={["bg-white py-6 flex flex-col justify-center items-center shadow cursor-pointer",className].join(" ")}>
			<span className="material-symbols-outlined bg-brand-secondary text-brand-primary p-3 rounded-full hover:opacity-85">
				{icon}
			</span>
			<span className="text-[18px] font-medium pt-2">{text}</span>
		</button>
	)
}