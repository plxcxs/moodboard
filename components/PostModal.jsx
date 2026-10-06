import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";
import CommentSection from "./CommentSection";

export default function PostModal({ picture, onClose }) {
    const [pictureShape, setPictureShape] = useState("landscape");
    const [pictureRatio, setPictureRatio] = useState(1);
    return (
        <StyledOverlay onClick={onClose}>
            <StyledCloseButton onClick={onClose}>close</StyledCloseButton>
            <StyledModalBox
                data-picture={pictureShape}
                onClick={(event) => event.stopPropagation()}
            >
                {picture.picture && (
                    <StyledImageBox
                        data-picture={pictureShape}
                        $ratio={pictureRatio}
                    >
                        <Image
                            fill
                            style={{ objectFit: "contain" }}
                            alt="post"
                            src={picture.picture}
                            onLoad={(event) => {
                                const { naturalWidth, naturalHeight } =
                                    event.target;
                                setPictureShape(
                                    naturalWidth > naturalHeight
                                        ? "landscape"
                                        : "portrait",
                                );
                                setPictureRatio(naturalWidth / naturalHeight);
                            }}
                        />
                    </StyledImageBox>
                )}
                {picture.text && (
                    <StyledText data-picture={pictureShape}>
                        {picture.text}
                    </StyledText>
                )}
                <StyledCommentBox>
                    <CommentSection pictureId={picture._id} />
                </StyledCommentBox>
            </StyledModalBox>
        </StyledOverlay>
    );
}

const StyledCommentBox = styled.div`
    order: 3;
    flex-shrink: 0;
`;

const StyledCloseButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
`;
const StyledOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1;
    background-color: #2727c0ab;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledModalBox = styled.div`
    width: 90vw;
    height: 90vh;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;

    @media (orientation: landscape) {
        &[data-picture="portrait"] {
            flex-direction: row;
            overflow: hidden;
        }
    }
    @media (orientation: portrait) {
        &[data-picture="landscape"] {
            overflow: hidden;
        }
    }
`;

const StyledImageBox = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    order: 1;

    @media (orientation: landscape) {
        &[data-picture="portrait"] {
            flex: 1;
            min-width: 0;
        }
    }
    @media (orientation: portrait) {
        height: auto;
        flex: none;
        aspect-ratio: ${(props) => props.$ratio};
        max-height: 65vh;
    }
`;

const StyledText = styled.div`
    padding: 10px;
    border-radius: 5px;
    order: 2;
    flex-shrink: 0;
    background-color: #389394e2;
    @media (orientation: landscape) {
        &[data-picture="portrait"] {
            order: 0;
            flex: 0 0 30%;
            overflow-y: auto;
        }
    }
    @media (orientation: portrait) {
        &[data-picture="landscape"] {
            order: 0;
            max-height: 30%;
            overflow-y: auto;
        }
    }
`;
