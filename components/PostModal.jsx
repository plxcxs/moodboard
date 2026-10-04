import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";

export default function PostModal({ picture, onClose }) {
    const [pictureShape, setPictureShape] = useState("landscape");

    return (
        <StyledOverlay onClick={onClose}>
            <StyledCloseButton onClick={onClose}>close</StyledCloseButton>
            <StyledModalBox
                data-picture={pictureShape}
                onClick={(event) => event.stopPropagation()}
            >
                {picture.picture && (
                    <StyledImageBox data-picture={pictureShape}>
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
                            }}
                        />
                    </StyledImageBox>
                )}
                {picture.text && (
                    <StyledText data-picture={pictureShape}>
                        {picture.text}
                    </StyledText>
                )}
            </StyledModalBox>
        </StyledOverlay>
    );
}
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
        &[data-picture="landscape"] {
            flex: 1;
            height: auto;
            min-height: 0;
        }
    }
`;

const StyledText = styled.div`
    order: 2;
    flex-shrink: 0;

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
