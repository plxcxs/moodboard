import styled from "styled-components";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function PictureCard({
    picture,
    isLiked,
    onLike,
    onDelete,
    onOpen,
}) {
    return (
        <StyledImageWrapper key={picture._id}>
            {picture.picture && (
                <StyledImageBox key={picture._id}>
                    <StyledImage
                        fill
                        key={picture._id}
                        src={picture.picture}
                        alt="picture"
                        onClick={onOpen}
                    />
                </StyledImageBox>
            )}

            {picture.text && (
                <StyledText onClick={onOpen}>{picture.text}</StyledText>
            )}

            <StyledOptionBar>
                <StyledLikeButton onClick={onLike}>
                    <Heart fill={isLiked ? "red" : "none"} />
                    <span> {picture.likes}</span>
                </StyledLikeButton>
                <StyledDeleteButton onClick={onDelete}>
                    Delete
                </StyledDeleteButton>
            </StyledOptionBar>
        </StyledImageWrapper>
    );
}
const StyledText = styled.p`
    background-color: #9ff;
    color: #000;
    @media (orientation: landscape) {
        max-width: 100%;
        overflow-wrap: anywhere;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        overflow: hidden;
    }
`;
const StyledLikeButton = styled.button`
    color: #fff;
    background-color: #000;
    border: #000;
`;
const StyledOptionBar = styled.div`
    display: flex;
    justify-content: space-around;
`;

const StyledImageWrapper = styled.div`
    border: 1px solid white;
    display: flex;
    flex-direction: column;
    width: 350px;
`;
const StyledImageBox = styled.div`
    /* margin: 10px; */
    position: relative;
    width: 350px;
    height: 350px;
    border-radius: 8px;
    overflow: hidden;
`;
const StyledImage = styled(Image)`
    object-fit: contain;
`;
const StyledDeleteButton = styled.button`
    /*  position: absolute; */
    z-index: 0;
    background-color: #959595;
    border: solid #000;
    border-radius: 5px;
    padding: 5px;
`;
