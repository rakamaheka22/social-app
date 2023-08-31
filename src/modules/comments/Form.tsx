import React, { useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/helper/api"
import { format } from "date-fns"

import { BiSend } from "react-icons/bi"

const FormComment = ({ postId }: any) => {
	const queryClient = useQueryClient()

    const commentInputRef = useRef<HTMLInputElement>(null)

	const addComment = async (postId: number, content: string) => {
		const res = await api.post("/comments/", {
			id: format(new Date(), 't'),
			content,
			postId,
			userId: 5,
		})
	}

	const commentMutation = useMutation({
		mutationFn: (value: any) => addComment(value.postId, value.content),
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["comments", postId],
				}),
				queryClient.invalidateQueries({ queryKey: ["posts"] }),
			]),
	})

    const onSubmitComment = async () => {
        if ((commentInputRef as any)?.current?.value) {
          const res = await commentMutation.mutate({
            postId,
            content: commentInputRef?.current?.value,
          });
          setTimeout(() => {
            (commentInputRef as any).current.value = ''
          }, 500);
        }
      };

	return (
		<form
            className="flex gap-4 border-t border-gray-700 pt-4"
            onSubmit={(e) => {
                e.preventDefault()
                onSubmitComment()
            }}
        >
			<input
                ref={commentInputRef}
                type="text"
				id="comment"
				className="block p-2.5 w-full text-sm bg-gray-800 text-white bg-gray-50 rounded-lg border-0 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Leave a comment..."
			></input>
			<button
				type="submit"
				className="h-[34px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
				<BiSend className="w-5 h-5text-white" />
			</button>
		</form>
	)
}

export default FormComment
