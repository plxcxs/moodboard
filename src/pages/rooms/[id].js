import { useRouter } from "next/router";
import useSWR from "swr";
import { useRef, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import Image from "next/image";

const fetcher = (URL) => fetch(URL).then((response) => response.json());

export default function RoomPage() {
    const router = useRouter();
    const { id } = router.query;

    const [openModal, setOpenModal] = useState(false);
    const [selectedPicture, setSelectedPicture] = useState(null);
    const timeReference = useRef(null);

    const {
        data: room,
        error,
        isLoading,
    } = useSWR(id ? `/api/rooms/${id}` : null, fetcher);

    const { data: pictures, mutate: mutatePictures } = useSWR(
        id ? `/api/pictures?roomId=${id}` : null,
        fetcher,
    );

    const [message, setMessage] = useState();

    function handleTouchStart(picture) {
        timeReference.current = setTimeout(() => {
            setSelectedPicture(picture);
            setOpenModal(true);
        }, 600);
    }
    function handleTouchEnd() {
        clearTimeout(timeReference.current);
    }
    function handleTouchMove() {
        clearTimeout(timeReference.current);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const formData = new FormData(event.target);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload Failed");
            }

            const data = await response.json();

            const pictureResponse = await fetch("/api/pictures", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ picture: data.secure_url, roomId: id }),
            });

            if (!pictureResponse.ok) {
                throw new Error("picture could not be saved");
            }

            mutatePictures();
        } catch (error) {
            console.error(error);
            setMessage(error.mesage || "something went wrong");
            setTimeout(() => setMessage(null), 3000);
        }
    }

    if (error) return <div>Error while Loading</div>;
    if (isLoading) return <div>Loading</div>;
    if (!room) return <div>loading ba</div>;

    return (
        <>
            <StyledBackLink href="/">back</StyledBackLink>
            <StyledImageForm $color={room.RoomColor} onSubmit={handleSubmit}>
                <label htmlFor="image">image upload</label>

                <StyledInput name="image" type="File"></StyledInput>
                <StyledUplaodButton type="submit">upload</StyledUplaodButton>
            </StyledImageForm>

            <StyledImageContainer>
                {" "}
                {openModal && selectedPicture && (
                    <StyledModalContainer>
                        <StyledModalBox>
                            <modal>
                                <p>You want to delete this picture?</p>
                                <button /* onClick={handleDelete(selectedPicture._id)} */
                                >
                                    Delete
                                </button>
                                <button onClick={() => setOpenModal(false)}>
                                    Cancel
                                </button>
                            </modal>
                        </StyledModalBox>
                    </StyledModalContainer>
                )}
                {pictures?.map((picture) => (
                    <>
                        <StyledImageBox key={picture._id}>
                            <StyledImage
                                fill
                                key={picture._id}
                                src={picture.picture}
                                alt="picture"
                                style={{ objectFit: "contain" }}
                                onTouchStart={() => handleTouchStart(picture)}
                                onTouchEnd={handleTouchEnd}
                                onTouchMove={handleTouchMove}
                            />
                        </StyledImageBox>
                    </>
                ))}
            </StyledImageContainer>
        </>
    );
}

const StyledModalContainer = styled.div`
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(59, 19, 19, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledModalBox = styled.div`
    background-color: rgba(23, 44, 57, 0.5);
    padding: 20px;
    border-radius: 10px;
`;

const StyledImageContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 15px;
`;
const StyledImageBox = styled.div`
    position: relative;
    width: 350px;
    height: 350px;
    border-radius: 8px;
    overflow: hidden;
`;
const StyledImage = styled(Image)``;

const StyledInput = styled.input`
    margin: 20px;
`;

const StyledUplaodButton = styled.button`
    margin: 15px;
`;

const StyledImageForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background-color: ${(props) => props.$color};
    margin: 15px;
    font-size: 24px;
`;

const StyledBackLink = styled(Link)`
    border-radius: 10%;
    margin: 10px;
    display: inline-block;
    padding: 10px;
    background-color: crimson;
`;
