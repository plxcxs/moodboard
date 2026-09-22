import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import styled from "styled-components";
const fetcher = (URL) => fetch(URL).then((response) => response.json());

export default function RoomPage() {
    const router = useRouter();
    const { id } = router.query;

    const {
        data: room,
        error,
        isLoading,
    } = useSWR(id ? `/api/rooms/${id}` : null, fetcher);

    if (error) return <div>Error while Loading</div>;
    if (isLoading) return <div>Loading</div>;
    if (!room) return <div>loading ba</div>;
    console.log(room);
    return (
        <>
            <StyledBackLink href="/">back</StyledBackLink>
            <form>
                <input type="File"></input>
            </form>

            <p> this is gonna be so cool {room.RoomColor}</p>
        </>
    );
}

const StyledBackLink = styled(Link)`
    border-radius: 10%;
    margin: 10px;
    display: inline-block;
    padding: 10px;
    background-color: crimson;
`;
