import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import PictureCard from "../../../components/PictureCard";
import ModalDelete from "../../../components/ModalDelete";
import PostModal from "../../../components/PostModal";
import UploadForm from "../../../components/UploadForm";
import styled from "styled-components";

const fetcher = (URL) => fetch(URL).then((response) => response.json());

export default function RoomPage() {
    const router = useRouter();
    const { id } = router.query;

    const [openModal, setOpenModal] = useState(false);
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [likedIds, setLikedIds] = useState([]);
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

    if (error) return <div>Error while Loading</div>;
    if (isLoading) return <div>Loading</div>;
    if (!room) return <div>loading ba</div>;

    return (
        <>
            <StyledBackLink href="/">back</StyledBackLink>
            <UploadForm
                roomId={id}
                color={room.RoomColor}
                onUploaded={mutatePictures}
            />
            <StyledImageContainer>
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
            {openModal && selectedPicture && (
                <ModalDelete
                    setOpenModal={setOpenModal}
                    handleDelete={handleDelete}
                    selectedPicture={selectedPicture}
                />
            )}
            {selectedPost && (
                <PostModal
                    picture={selectedPost}
                    onClose={() => setSelectedPost(null)}
                ></PostModal>
            )}
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

const StyledBackLink = styled(Link)`
    border-radius: 10%;
    margin: 10px;
    display: inline-block;
    padding: 10px;
    background-color: crimson;
`;
