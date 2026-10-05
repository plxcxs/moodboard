import { useRouter } from "next/router";
import useSWR from "swr";
import { useRef, useState } from "react";
import Link from "next/link";
import PictureCard from "../../../components/PictureCard";
import ModalDelete from "../../../components/ModalDelete";
import PostModal from "../../../components/PostModal";

const fetcher = (URL) => fetch(URL).then((response) => response.json());

export default function RoomPage() {
    const router = useRouter();
    const { id } = router.query;

    const [isUploading, setIsUploading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [likedIds, setLikedIds] = useState([]);
    const [message, setMessage] = useState();
    const [hasImage, setHasImage] = useState(false);
    const [text, setText] = useState("");
    const isEmpty = text.trim() === "" && !hasImage;
    const [selectedPost, setSelectedPost] = useState(null);

    const {
        data: room,
        error,
        isLoading,
    } = useSWR(id ? `/api/rooms/${id}` : null, fetcher);

    const { data: pictures, mutate: mutatePictures } = useSWR(
        id ? `/api/pictures?roomId=${id}` : null,
        fetcher,
    );

    async function handleLike(picture) {
        const isLiked = likedIds.includes(picture._id);

        if (isLiked) {
            await fetch(`/api/pictures/like?id=${picture._id}`, {
                method: "DELETE",
            });
            setLikedIds(likedIds.filter((id) => id !== picture._id));
        } else {
            await fetch(`/api/pictures/like?id=${picture._id}`, {
                method: "POST",
            });
            setLikedIds([...likedIds, picture._id]);
        }
        mutatePictures();
    }

    function handleModal(picture) {
        setSelectedPicture(picture);
        setOpenModal(true);
    }

    async function handleDelete() {
        try {
            const response = await fetch(
                `/api/pictures/${selectedPicture._id}`,
                {
                    method: "DELETE",
                },
            );
            if (!response.ok) {
                throw new Error("Deleting Failed");
            }
            mutatePictures();
            setOpenModal(false);
        } catch (error) {
            console.error(error);
        }
    }

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
                    roomId: id,
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
            mutatePictures();
        } catch (error) {
            console.error(error);
            setMessage(error.message || "something went wrong");
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setIsUploading(false);
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
                <StyledInput
                    id="image"
                    name="image"
                    accept="image/*"
                    type="File"
                    onChange={(event) =>
                        setHasImage(event.target.files.length > 0)
                    }
                />
                <label htmlFor="text">text input</label>
                <textarea
                    value={text}
                    name="text"
                    id="text"
                    placeholder="Type here"
                    onChange={(event) => setText(event.target.value)}
                ></textarea>
                <StyledUplaodButton
                    disabled={isUploading || isEmpty}
                    type="submit"
                >
                    upload
                </StyledUplaodButton>
            </StyledImageForm>

            <StyledImageContainer>
                {openModal && selectedPicture && (
                    <>
                        <ModalDelete
                            setOpenModal={setOpenModal}
                            handleDelete={handleDelete}
                            selectedPicture={selectedPicture}
                        />
                    </>
                )}
                {selectedPost && (
                    <PostModal
                        picture={selectedPost}
                        onClose={() => setSelectedPost(null)}
                    ></PostModal>
                )}
                {pictures?.map((picture) => (
                    <PictureCard
                        key={picture._id}
                        picture={picture}
                        isLiked={likedIds.includes(picture._id)}
                        onLike={() => handleLike(picture)}
                        onDelete={() => handleModal(picture)}
                        onOpen={() => setSelectedPost(picture)}
                    />
                ))}
            </StyledImageContainer>
        </>
    );
}

const StyledImageContainer = styled.div`
    padding: 5px;

    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 15px;
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

const StyledBackLink = styled(Link)`
    border-radius: 10%;
    margin: 10px;
    display: inline-block;
    padding: 10px;
    background-color: crimson;
`;
