/* import Image from "next/image";
import styled from "styled-components";

export default function PostModal({ picture, onClose }) {
    return (
        <StyledOverlay>
            <StyledModalBox>
                {picture.picture && (
                    <StyledImageBox>
                        <Image
                            fill
                            style={{ objectFit: "contain" }}
                            alt="post"
                            src={picture.picture}
                        />
                        <StyledText>{picture.text}</StyledText>
                    </StyledImageBox>
                )}
                <button onClick={onClose}> close</button>
            </StyledModalBox>
        </StyledOverlay>
    );
}
const StyledText = styled.div`
    background-color: lime;
    color: black;
    font-size: large;
    font-weight: bold;
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
    width: 100vw;
    height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    @media (min-width: 768px) {
        width: 80vw;
        height: 80vh;
    }
    @media (orientation: landscape) and (min-width: 768px) {
        flex-direction: row;
        align-items: stretch;
    }
`;

const StyledImageBox = styled.div`
    position: relative;
    width: 100%;
    flex: 1;
`;
 */

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
    overflow-y: auto; /* base: whole box scrolls */

    @media (orientation: landscape) {
        &[data-picture="portrait"] {
            flex-direction: row; /* text left of picture */
            overflow: hidden; /* the text scrolls instead */
        }
    }
    @media (orientation: portrait) {
        &[data-picture="landscape"] {
            overflow: hidden; /* text above picture, text scrolls */
        }
    }
`;

const StyledImageBox = styled.div`
    position: relative;
    width: 100%;
    height: 100%; /* base: picture fills the box, text is below */
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
    /* keep your lime/black/bold styling here */

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
