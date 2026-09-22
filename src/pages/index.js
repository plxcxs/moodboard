import Head from "next/head";
import Image from "next/image";

import List from "../../components/List";
import Link from "next/link";
import useSWR from "swr";
import RoomForm from "../../components/RoomForm";

const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
    const {
        data: pictures,
        error,
        isLoading,
    } = useSWR("/api/pictures", fetcher);

    if (error) return <div>error buhhuu</div>;
    if (isLoading) return <div>is loading beeeheee</div>;
    console.log(pictures[0]);
    return (
        <>
            <Head>
                <title>Moodboard</title>
            </Head>
            <List />
            {pictures.map((picture) => {
                return (
                    <Link key={picture._id} href={`/pictures/${picture._id}`}>
                        link
                    </Link>
                );
            })}
            <RoomForm />
            <div>hi</div>
        </>
    );
}
