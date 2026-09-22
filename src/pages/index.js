import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import List from "../../components/List";
import Link from "next/link";
import useSWR from "swr";
import RoomForm from "../../components/RoomForm";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
    const { data: rooms, error, isLoading } = useSWR("/api/rooms", fetcher);

    if (error) return <div>error buhhuu</div>;
    if (isLoading) return <div>is loading beeeheee</div>;
    console.log(rooms[0]);
    return (
        <>
            <Head>
                <title>Moodboard</title>
            </Head>
            <RoomForm />
            <StyledSection>
                {rooms.map((room) => {
                    return (
                        <StyledLink
                            $color={room.RoomColor}
                            key={room._id}
                            href={`/rooms/${room._id}`}
                        >
                            {room.RoomName}
                        </StyledLink>
                    );
                })}
            </StyledSection>
        </>
    );
}

const StyledLink = styled(Link)`
    padding: 10px;
    margin: 5px;
    background-color: ${(props) => props.$color};
`;

const StyledSection = styled.section`
    display: flex;
    flex-direction: column;
`;
