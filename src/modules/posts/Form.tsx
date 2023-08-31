import React, { useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/helper/api"
import { format } from "date-fns"
import { waitUntil } from "@/helper/general"

const FormPost = () => {
	const queryClient = useQueryClient()

	const postInputRef = useRef<HTMLInputElement>(null)

	const addPost = async (content: string) => {
		const res = await api.post("/posts/", {
			id: format(new Date(), 't'),
			content,
			isLiked: false,
			createdDate: new Date().toISOString(),
			userId: 5,
		})
	}

	const postMutation = useMutation({
		// mutationFn: (value: any) => addPost(value.content),
		mutationFn: (value: any) => waitUntil(3000).then(() => addPost(value.content)),
		onError: (err) => console.error(err), 
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	})

	const onSubmitPost = async () => {
		if ((postInputRef as any)?.current?.value) {
			const res = await postMutation.mutate({
				content: postInputRef?.current?.value,
			})
			setTimeout(() => {
				;(postInputRef as any).current.value = ""
			}, 500)
		}
	}

	return (
		<>
			<form
				className="flex gap-4 border-t border-gray-700 pt-4"
				onSubmit={(e) => {
					e.preventDefault()
					onSubmitPost()
				}}
			>
				<input
					ref={postInputRef}
					type="text"
					id="comment"
					className="text-[22px] block p-2.5 w-full text-sm bg-transparent text-white bg-gray-50 rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="What is happening?!"
				></input>
				<button
					type="submit"
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
				>
					Post
				</button>
			</form>
			{postMutation?.isLoading && <div className="text-center">Loading your post...</div>}
		</>
	)
}

export default FormPost
