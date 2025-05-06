import { useState } from "react";

const useApproveMessage = () => {
    const approveMessage = async (meetingId: string, clientId: string, content: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/speech/tts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                group_name: meetingId,
                user_id: clientId,
                employee_approved_msg: content,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to approve message");
        }

        return await response.json();
    };

    return { approveMessage };
};

export default useApproveMessage;