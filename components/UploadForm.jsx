import styled from "styled-components";
import { useState } from "react";

export default function UploadForm({ roomId, color, onUploaded }) {
    const [isUploading, setIsUploading] = useState(false);
    const [hasImage, setHasImage] = useState(false);
    const [text, setText] = useState("");
    const [message, setMessage] = useState();
    const isEmpty = text.trim() === "" && !hasImage;

    async function handleSubmit(event) {
        event.preventDefault();
        setIsUploading(true);
        try {
            const form = event.target;
            const formData = new FormData(form);
            const imageFile = formData.get("image");
            const trimmedText = text.trim();

            let imageUrl;
            let publicId;

            if (imageFile && imageFile.size > 0) {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Upload Failed");
                }

                const data = await response.json();
                imageUrl = data.secure_url;
                publicId = data.public_id;
            }

            if (!imageUrl && !trimmedText) {
                throw new Error("please add a text or an image");
            }

            const pictureResponse = await fetch("/api/pictures", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    picture: imageUrl,
                    roomId,
                    publicId: publicId,
                    text: trimmedText,
                }),
            });

            if (!pictureResponse.ok) {
                throw new Error("picture could not be saved");
            }
            form.reset();
            setText("");
            setHasImage(false);
            onUploaded();
        } catch (error) {
            console.error(error);
            setMessage(error.message || "something went wrong");
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <StyledImageForm $color={color} onSubmit={handleSubmit}>
            <label htmlFor="image">image upload</label>
            <StyledInput
                id="image"
                name="image"
                accept="image/*"
                type="File"
                onChange={(event) => setHasImage(event.target.files.length > 0)}
            />
            <label htmlFor="text">text input</label>
            <StyledTextArea
                value={text}
                name="text"
                id="text"
                placeholder="Type here"
                onChange={(event) => setText(event.target.value)}
            ></StyledTextArea>
            <StyledUplaodButton disabled={isUploading || isEmpty} type="submit">
                upload
            </StyledUplaodButton>
        </StyledImageForm>
    );
}
const StyledTextArea = styled.textarea`
    resize: none;
`;
const StyledInput = styled.input`
    margin: 20px;
`;

const StyledUplaodButton = styled.button`
    margin: 15px;
`;

const StyledImageForm = styled.form`
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background-color: ${(props) => props.$color};
    margin: 15px;
    font-size: 24px;
`;
