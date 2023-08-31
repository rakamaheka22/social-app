import React from "react"
import api from "@/helper/api"
import { useQuery } from "@tanstack/react-query"

const ListUser = ({ users, isSuccess }: any) => {
	// const fetchUsers = async () => {
	// 	return await api.get(
	// 		"/users/"
	// 	)
	// }

	// const {
	// 	data: users,
	// 	isError,
	// 	isSuccess,
	// 	isLoading,
	// } = useQuery({
	// 	queryKey: ["users"],
	// 	queryFn: fetchUsers,
	// 	// queryFn: () => waitUntil(3000).then(() => fetchPosts()),
	// 	// queryFn: () => Promise.reject(waitUntil(3000)),
	// })

	return isSuccess && (
		<div>
			<h2 className="font-semibold mb-4 text-[22px]">Your Friends</h2>
			<div className="flex items-center gap-4 overflow-x-auto">
				{users?.data?.map((user: any) => (
					<div key={user?.id} className="min-w-[200px] flex flex-col items-center justify-center gap-4 max-w-sm p-6 border-0 rounded-lg shadow bg-gray-800">
						<img
							className="w-[100px] h-[100px] rounded-full"
							src={user?.image}
							alt={user?.name}
							title={user?.name}
							draggable="false"
							decoding="async"
						/>
						<div className="text-[16px] font-semibold">
							{user?.name}
						</div>
					</div>
				))}
		</div>
		</div>
	)
}

export default ListUser
