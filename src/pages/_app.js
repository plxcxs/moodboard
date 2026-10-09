import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Login from "../../components/Login";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <SessionProvider session={session}>
            <Login />

            <Component {...pageProps} />
        </SessionProvider>
    );
}
