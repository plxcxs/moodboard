import { useState } from "react";
import useSWR from "swr";
import styled from "styled-components";

const fetcher = (URL) => fetch(URL).then((response) => response.json());

export default function CommentSection({ pictureId }) {
    const [comment, setComment] = useState("");
    const isEmpty = comment.trim() === "";

    const { data: comments, mutate: mutateComments } = useSWR(
        pictureId ? `/api/comments?pictureId=${pictureId}` : null,
        fetcher,
    );

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: comment, pictureId }),
            });
            if (!response.ok) {
                throw new Error("Comment could not be saved");
            }
            setComment("");
            mutateComments();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="comment">comment</label>
                <br />
                <StyledTextArea
                    id="comment"
                    name="comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />
                <button disabled={isEmpty}>send</button>
            </form>
            {comments?.map((singleComment) => (
                <StyledComment key={singleComment._id}>
                    {singleComment.text}
                </StyledComment>
            ))}
        </>
    );
}

const StyledTextArea = styled.textarea`
    resize: none;
`;

const StyledComment = styled.div`
    padding: 3vw;
    background-color: #9fa3b4c5;
    border: 1px solid red;
    color: #000;
    font-size: larger;
    font-weight: bold;
`;
