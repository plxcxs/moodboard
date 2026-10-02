import Image from "next/image";
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
                    </StyledImageBox>
                )}
                <button onClick={onClose}> close</button>
            </StyledModalBox>
        </StyledOverlay>
    );
}

const StyledOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1;
    background-color: #c0272777;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const StyledModalBox = styled.div`
    width: 80vw;
    height: 80vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

const StyledImageBox = styled.div`
    position: relative;
    width: 100%;
    flex: 1;
`;
