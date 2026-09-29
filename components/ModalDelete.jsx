import styled from "styled-components";

export default function ModalDelete({
    setOpenModal,
    handleDelete,
    selectedPicture,
}) {
    return (
        <StyledModalContainer>
            <StyledModalBox>
                <p>You want to delete this picture?</p>
                <button onClick={() => handleDelete(selectedPicture._id)}>
                    Delete
                </button>
                <button onClick={() => setOpenModal(false)}>Cancel</button>
            </StyledModalBox>
        </StyledModalContainer>
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
