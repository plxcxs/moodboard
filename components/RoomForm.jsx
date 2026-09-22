import { useState } from "react";
import styled from "styled-components";
import { mutate } from "swr";
export default function RoomForm() {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formObject = Object.fromEntries(formData.entries());

        const URL = "/api/rooms";
        const method = "POST";

        try {
            const response = await fetch(URL, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formObject),
            });
            if (response.ok) {
                await mutate("/api/rooms");
                setSuccessMessage("room creation successful");
                setTimeout(() => setSuccessMessage(""), 3000);
                event.target.reset();
            } else {
                setErrorMessage("Sorry not able to create room");
                setTimeout(() => setErrorMessage(""), 3000);
            }
        } catch (error) {
            console.error("Network Error:", error);
            setErrorMessage(
                "network error, please check ur connection and try again",
            );
            setTimeout(() => setErrorMessage(""), 3000);
        }
    }

    return (
        <>
            {errorMessage && <p>{errorMessage}</p>}
            {successMessage && <p>{successMessage}</p>}
            <StyledForm action="submit" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="RoomName">Room Name</label>
                    <input name="RoomName" type="text" />
                </div>
                <div>
                    <label htmlFor="RoomColor">Room Color</label>
                    <input name="RoomColor" type="color" />
                </div>
                <button type="submit">create room</button>
            </StyledForm>
        </>
    );
}

const StyledForm = styled.form`
    margin: 20px;
    background-color: #97198b;
    padding: 5px;
    border-radius: 15px;
`;
