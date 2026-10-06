import { useState } from "react";
import useSWR from "swr";

const fetcher = (URL) => fetch(URL).then((response) => response.json());

export default function CommentSection({ pictureId }) {
    const [comment, setComment] = useState("");
    const isEmpty = comment.trim() === "";

    const { data: comments, mutate: mutateComments } = useSWR(
        pictureId ? `/api/comments?pictureId=${pictureId}` : null,
        fetcher,
    );

    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="comment">comment</label>
                <br />
                <input
                    id="comment"
                    name="comment"
                    type="text"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />
                <button disabled={isEmpty}>send</button>
            </form>
            {comments?.map((singleComment) => (
                <div key={singleComment._id}>{singleComment.text}</div>
            ))}
        </>
    );
}
