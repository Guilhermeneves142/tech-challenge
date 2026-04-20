"use client"

import Link from "next/link";
import { useState } from "react"

export default function DashboardMenu() {

	const [ selectedMenu, setSelectedMenu] = useState("home");

	function checkSelected(key: string) {
		return selectedMenu == key
	}

	return (
		<section className="bg-white w-full p-4 flex flex-col gap-2">
			<DashboardMenuItem
				name="Home"
				route="/dashboard"
				icon="home"
				selected={checkSelected("home")}
				onSelect={() => setSelectedMenu("home")}
			/>
			<DashboardMenuItem
				name="Relatórios Financeiros"
				icon="credit_card"
				route="/finantial-reports"
				selected={checkSelected("finantial-reports")}
				onSelect={() => setSelectedMenu("finantial-reports")}
			/>
		</section>
	)
}

type DashboardMenuItemProps = {
	name: string;
	route: string;
	selected: boolean;
	icon: string;
	onSelect: () => void;
}

function DashboardMenuItem({name, route, selected, onSelect, icon}: DashboardMenuItemProps) {
	const itemClass = selected
		? "text-white bg-brand-tertiary hover:opacity-90"
		: "text-text-secondary hover:bg-gray-100"

	return (
			<Link
				className={["px-4 py-3  rounded-md flex items-center gap-2", itemClass].join(" ")}
				onClick={onSelect}
				role="button"
				tabIndex={0}
				aria-label={name}
				href={route}
			>
				<span className="font-medium text-[14px] material-symbols-outlined">{icon}</span>
				<span className="font-medium text-[14px]">{name}</span>
			</Link>
	)
}
