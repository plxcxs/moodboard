import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (URL) => fetch(URL).then((response) => response.json());

export default function PicturePage() {
    const router = useRouter();
    const { id } = router.query;

    const {
        data: picture,
        error,
        isLoading,
    } = useSWR(id ? `/api/pictures/${id}` : null, fetcher);

    if (error) return <div>Error while Loading</div>;
    if (isLoading) return <div>Loading</div>;
    if (!picture) return <div>loading ba</div>;
    console.log(picture);
    return (
        <div>
            <p> this is gonna be so cool {picture._id}</p>
        </div>
    );
}
