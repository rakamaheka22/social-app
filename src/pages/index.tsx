import { Work_Sans } from "next/font/google"

import Logo from "@/modules/icons/Logo"
import ListPost from "@/modules/posts/List"
import FormPost from "@/modules/posts/Form"
import ListUser from "@/modules/users/List"

const workSans = Work_Sans({ subsets: ["latin"] })

export default function Home() {
	return (
		<main
			className={`max-w-2xl m-auto flex flex-col p-6 gap-4 ${workSans.className}`}
		>
			<Logo />
			<FormPost />
			<ListPost />
			<ListUser />
		</main>
	)
}
