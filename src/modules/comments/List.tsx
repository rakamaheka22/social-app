import React from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/helper/api"
import { formatDate } from "@/helper/date"
import clsx from "clsx"

const ListComment = ({ postId, isCommentOpen }: any) => {
	const fetchComments = async (postId: number) => {
		return await api.get(
			`/comments/?postId=${postId}&_page=1&_limit=5&_sort=createdDate&_order=desc&_expand=user`
		)
	}

	const {
		data: comments,
		isError,
		isSuccess,
		isLoading,
	} = useQuery({
		queryKey: ["comments", postId],
        enabled: !!isCommentOpen,
		queryFn: () => fetchComments(postId),
	})

	return (
		<div>
			{isSuccess &&
				(comments?.data ?? []).map((comment: any) => (
					<div
						key={`post-${comment?.id}`}
						className={clsx({
							"flex flex-col items-start py-4 gap-4 border-b border-gray-700 last:border-0": true,
						})}
					>
						<div className="w-full flex items-start gap-4">
							<img
								className="w-[48px] h-[48px] rounded-full"
								src={comment?.user?.image}
								alt={comment?.user?.name}
								title={comment?.user?.name}
								draggable="false"
								decoding="async"
							/>
							<div className="w-full">
								<div className="flex items-center gap-2 text-sm mb-2">
									<span className="font-semibold">
										{comment?.user?.name}
									</span>
									<span className="text-gray-400">
										{formatDate(comment?.createdDate)}
									</span>
								</div>
								<p className="text-sm">{comment?.content}</p>
							</div>
						</div>
					</div>
				))}
		</div>
	)
}

export default ListComment
