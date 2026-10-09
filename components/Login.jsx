import { useSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";

export default function Component() {
    const { data: session } = useSession();

    if (session) {
        return (
            <StyledLogin>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </StyledLogin>
        );
    }
    return (
        <StyledLogin>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
            <Link href="/register">Register</Link>
        </StyledLogin>
    );
}
const StyledLogin = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    padding: 10px;
`;
