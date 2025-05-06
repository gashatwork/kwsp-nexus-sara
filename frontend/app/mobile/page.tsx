"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Terms from "@/components/mobile/Terms";
import Chat from "@/components/mobile/Chat";

export default function MobilePage() {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [sessionValid, setSessionValid] = useState(false);
    // const searchParams = useSearchParams();
    const router = useRouter();

    const sessionId = '123'; //searchParams.get("sessionId");
    // console.log("sessionId", sessionId);
    // console.log("searchParams", searchParams.toString());
    useEffect(() => {
        // Validate the session with the backend
        const validateSession = async () => {
            const response = await fetch(`/api/session/validate?sessionId=${sessionId}`);
            const data = await response.json();
            if (data.valid) {
                setSessionValid(true);
            } else {
                router.push("/error"); // Redirect to an error page if session is invalid
            }
        };

        if (sessionId) {
            setSessionValid(true);
            // validateSession();
        }
    }, [sessionId, router]);

    const handleAcceptTerms = async () => {
        // // Update session state on the backend
        // await fetch(`/api/session/update`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ sessionId, termsAccepted: true }),
        // });

        setTermsAccepted(true);
    };

    return termsAccepted ? <Chat /> : <Terms onAccept={handleAcceptTerms} />;
}



// import Terms from "@/components/mobile/Terms";
// import Chat from "@/components/mobile/Chat";

// export default function MobilePage() {
//     return (
//         <>
//             <Terms />
//             <Chat />
//         </>
//     );
// }