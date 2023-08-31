import api from "@/helper/api"
import { formatDate } from "@/helper/date"
import { waitUntil } from "@/helper/general"
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"

import { BiHeart, BiSolidHeart, BiComment, BiSolidComment } from "react-icons/bi"
import ListComment from "../comments/List"
import FormComment from "../comments/Form"
import ListUser from "../users/List"

const ListItem = ({ post }: any) => {
	const [isCommentOpen, setIsCommentOpen] = useState(false)

	const queryClient = useQueryClient()

    const addReactions = async ({ postId, post }: any) => {
		return await api.put(`/posts/${postId}`, {
			...post,
		})
	}

	const reactionMutation = useMutation({
		mutationFn: (params: any) => addReactions(params),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	})

	return (
		<div className="w-full flex items-start gap-4">
			<img
				className="w-[48px] h-[48px] rounded-full"
				src={post?.user?.image}
				alt={post?.user?.name}
				title={post?.user?.name}
				draggable="false"
				decoding="async"
			/>
			<div className="w-full">
				<div className="flex items-center gap-2 text-sm mb-2">
					<span className="font-semibold">{post?.user?.name}</span>
					<span className="text-gray-400">
						{formatDate(post?.createdDate)}
					</span>
				</div>
				<p className="text-[18px]">{post?.content}</p>
				<div className="w-full flex gap-10 justify-end items-center mt-2">
					<button
						onClick={() =>
							reactionMutation.mutate({
								postId: post?.id,
								post: {
									...post,
									isLiked: !post?.isLiked,
								},
							})
						}
					>
						{post?.isLiked ? (
							<BiSolidHeart className="w-5 h-5 text-red-500 hover:text-red-700 transition-all duration-300 ease-in-out" />
						) : (
							<BiHeart className="w-5 h-5 text-gray-400 hover:text-white transition-all duration-300 ease-in-out" />
						)}
					</button>
					<button
                        className="group flex items-center gap-2"
						onClick={() =>
							setIsCommentOpen((oldValue) => !oldValue)
						}
					>
						{isCommentOpen ? (
							<BiSolidComment className="w-5 h-5 text-gray-400 group-hover:text-white transition-all duration-300 ease-in-out" />
						) : (
							<BiComment className="w-5 h-5 text-gray-400 group-hover:text-white transition-all duration-300 ease-in-out" />
						)}
                        {post?.comments?.length > 0 && <span className="text-sm text-gray-400 group-hover:text-white">{post?.comments?.length}</span>}
					</button>
				</div>
                {isCommentOpen && (
					<>
						<ListComment {...{ postId: post?.id, isCommentOpen }} />
						<FormComment {...{ postId: post?.id }} />
					</>
				)}
			</div>
		</div>
	)
}

const ListPost = () => {
	const fetchPosts = async () => {
		return await api.get(
			"/posts?_page=1&_limit=5&_sort=createdDate&_order=desc&_expand=user&_embed=comments"
		)
	}

	const fetchUsers = async () => {
		return await api.get(
			"/users/"
		)
	}

	// const {
	// 	data: posts,
	// 	isError,
	// 	isSuccess,
	// 	isLoading,
	// } = useQuery({
	// 	queryKey: ["posts"],
	// 	queryFn: fetchPosts,
	// 	// queryFn: () => waitUntil(3000).then(() => fetchPosts()),
	// 	// queryFn: () => Promise.reject(waitUntil(3000)),
	// })

	const userQueries = useQueries({
		queries: [
			{
				queryKey: ["posts"],
				queryFn: fetchPosts,
			},
			{
				queryKey: ["users"],
				queryFn: fetchUsers,
			},
		].map(query => {
			return query
		}),
	})

	return (
		<>
			<div className="w-full my-4">
				{userQueries[0]?.isLoading && <div className="text-center">Loading post...</div>}
				{userQueries[0]?.isError && (
					<div className="text-center">
						Failed to load posts. Try again
					</div>
				)}
				{userQueries[0]?.isSuccess &&
					(userQueries[0]?.data?.data ?? []).map((post: any) => (
						<div
							key={`post-${post?.id}`}
							className="flex flex-col items-start py-4 gap-4 border-b border-gray-700"
						>
							<ListItem {...{ post }} />
						</div>
					))}
			</div>
			<ListUser users={userQueries[1]?.data} isSuccess={userQueries[1]?.isSuccess} />
		</>
	)
}

export default ListPost
