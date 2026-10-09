import Head from "next/head";
import styled from "styled-components";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import RoomForm from "../../components/RoomForm";
import { useSession } from "next-auth/react";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
    const { data: rooms, error, isLoading } = useSWR("/api/rooms", fetcher);
    const { data: session } = useSession();

    if (error) return <div>error buhhuu</div>;
    if (isLoading) return <div>is loading beeeheee</div>;

    async function handleDeleteRoom(id) {
        try {
            const response = await fetch(`/api/rooms/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                await mutate("/api/rooms");
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <Head>
                <title>Moodboard</title>
            </Head>
            {session && (
                <>
                    <RoomForm />
                    <StyledSection>
                        {rooms.map((room) => {
                            return (
                                <StyledLink
                                    $color={room.RoomColor}
                                    key={room._id}
                                    href={`/rooms/${room._id}`}
                                >
                                    <StyledDiv>{room.RoomName}</StyledDiv>

                                    <button
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            handleDeleteRoom(room._id);
                                        }}
                                    >
                                        Delete Room
                                    </button>
                                </StyledLink>
                            );
                        })}
                    </StyledSection>
                </>
            )}
        </>
    );
}

const StyledDiv = styled.div`
    border-radius: 5px;
    margin: 3px;
    padding: 5px;
    color: #fafffa;
    /* min-width: content; */
    background-color: rgb(9, 9, 9);
`;

const StyledLink = styled(Link)`
    border-radius: 5px;
    display: flex;
    padding: 10px;
    margin: 5px;
    background-color: ${(props) => props.$color};
    justify-content: space-between;
`;

const StyledSection = styled.section`
    display: flex;
    flex-direction: column;
`;
