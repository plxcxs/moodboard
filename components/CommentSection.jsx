import { useState } from "react";

export default function CommentSection({ pictureId }) {
    const [comment, setComment] = useState("");
    const isEmpty = comment.trim() === "";

    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
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
        </form>
    );
}
