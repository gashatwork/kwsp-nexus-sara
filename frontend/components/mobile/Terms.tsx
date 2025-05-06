import { Box, Flex, Text, Heading, Button, Switch, TextArea } from '@radix-ui/themes';
import Logo from "@/components/Logo";

export default function Terms({ onAccept }: { onAccept: () => void }) {
    const terms_en = `1. Acceptance of Terms:
By clicking "Enter Meeting" or proceeding to join this virtual meeting room, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not enter the meeting.  
2. Purpose of the Meeting and Data Collection:
This virtual meeting is intended for discussions related to retirement planning and Employee Provident Fund (EPF) queries. To facilitate this meeting and provide you with relevant information and follow-up, we will collect and process certain personal details, including but not limited to your name, contact information (such as email address and phone number), and any questions or information you may share during the meeting.
3. Consent to Data Collection and Use:
By entering this virtual meeting room, you explicitly consent to the collection, processing, and storage of your personal details as described in these Terms and Conditions and our Privacy Policy [Link to your Privacy Policy]. This consent allows us to:
Facilitate the meeting and address your queries.
Personalize your experience and provide relevant information.
Follow up with you regarding your retirement planning and EPF queries.
Improve our services and offerings.
You have the right to withdraw your consent at any time by [Explain how users can withdraw consent, e.g., contacting a specific email address]. Withdrawing your consent may affect our ability to provide you with further assistance or follow-up.
4. Use of Information:
The personal information collected will be used solely for the purposes outlined in these Terms and Conditions and our Privacy Policy. We will not share your personal information with third parties except as necessary to provide the services related to this meeting or as required by law.
5. Security of Your Information:
We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, please be aware that no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.`

    const terms = `অবশ্যই, এখানে উপরের বিবৃতিগুলো বাংলায় দেওয়া হলো:
১. শর্তাবলীর স্বীকৃতি:
"মিটিং-এ প্রবেশ করুন" অথবা এই ভার্চুয়াল মিটিং রুমে যোগদানের জন্য অগ্রসর হওয়ার মাধ্যমে, আপনি স্বীকার করছেন যে আপনি এই শর্তাবলী পড়েছেন, বুঝেছেন এবং এর দ্বারা আবদ্ধ হতে সম্মত হচ্ছেন। যদি আপনি এই শর্তাবলীতে সম্মত না হন, তবে মিটিং-এ প্রবেশ করবেন না।
২. মিটিং-এর উদ্দেশ্য এবং ডেটা সংগ্রহ:
এই ভার্চুয়াল মিটিংটি অবসর পরিকল্পনা এবং কর্মচারী ভবিষ্য তহবিল (ইপিএফ) সম্পর্কিত আলোচনার জন্য অনুষ্ঠিত হচ্ছে। এই মিটিং পরিচালনা করতে এবং আপনাকে প্রাসঙ্গিক তথ্য ও ফলো-আপ প্রদান করতে, আমরা আপনার কিছু ব্যক্তিগত বিবরণ সংগ্রহ ও প্রক্রিয়া করব, যার মধ্যে আপনার নাম, যোগাযোগের তথ্য (যেমন ইমেল ঠিকানা এবং ফোন নম্বর) এবং মিটিং চলাকালীন আপনার শেয়ার করা যেকোনো প্রশ্ন বা তথ্য অন্তর্ভুক্ত থাকতে পারে তবে তা সীমাবদ্ধ নয়।
৩. ডেটা সংগ্রহ ও ব্যবহারের সম্মতি:
এই ভার্চুয়াল মিটিং রুমে প্রবেশ করার মাধ্যমে, আপনি স্পষ্টভাবে এই শর্তাবলী এবং আমাদের গোপনীয়তা নীতি [আপনার গোপনীয়তা নীতির লিঙ্ক] অনুসারে আপনার ব্যক্তিগত বিবরণ সংগ্রহ, প্রক্রিয়াকরণ এবং সংরক্ষণে সম্মতি দিচ্ছেন। এই সম্মতি আমাদের নিম্নলিখিত বিষয়গুলো করতে অনুমতি দেয়:
মিটিং পরিচালনা করা এবং আপনার প্রশ্নের উত্তর দেওয়া।
আপনার অভিজ্ঞতা ব্যক্তিগতকৃত করা এবং প্রাসঙ্গিক তথ্য প্রদান করা।
আপনার অবসর পরিকল্পনা এবং ইপিএফ সংক্রান্ত জিজ্ঞাসায় ফলো-আপ করা।
আমাদের পরিষেবা এবং অফার উন্নত করা।
আপনার যে কোনো সময় আপনার সম্মতি প্রত্যাহার করার অধিকার আছে [ব্যবহারকারীরা কীভাবে সম্মতি প্রত্যাহার করতে পারে তা ব্যাখ্যা করুন, যেমন, একটি নির্দিষ্ট ইমেল ঠিকানায় যোগাযোগ করে]। আপনার সম্মতি প্রত্যাহার করলে আপনাকে আরও সহায়তা বা ফলো-আপ প্রদানে আমাদের ক্ষমতা প্রভাবিত হতে পারে।
৪. তথ্যের ব্যবহার:
সংগৃহীত ব্যক্তিগত তথ্য শুধুমাত্র এই শর্তাবলী এবং আমাদের গোপনীয়তা নীতিতে বর্ণিত উদ্দেশ্যগুলির জন্য ব্যবহার করা হবে। এই মিটিং সম্পর্কিত পরিষেবা প্রদানের জন্য বা আইন দ্বারা প্রয়োজনীয়তা ব্যতীত আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করব না।
৫. আপনার তথ্যের নিরাপত্তা:
আমরা আপনার ব্যক্তিগত তথ্য অননুমোদিত অ্যাক্সেস, ব্যবহার বা প্রকাশ থেকে রক্ষা করার জন্য যুক্তিসঙ্গত ব্যবস্থা গ্রহণ করি। তবে, দয়া করে মনে রাখবেন যে ইন্টারনেটের মাধ্যমে সংক্রমণ বা ইলেকট্রনিক স্টোরেজের কোনও পদ্ধতি সম্পূর্ণ নিরাপদ নয় এবং আমরা সম্পূর্ণ নিরাপত্তার গ্যারান্টি দিতে পারি না।`;

    return (
        <Flex direction="column" justify="center" className="h-screen p-6">
            <Flex direction="column">
                <Flex direction="column" align="center" gap="3">
                    <Logo />
                    <Heading size="6" mt="3">Welcome to KWSP!</Heading>
                    <Text weight="bold">Abdul Aziz</Text>
                </Flex>

                <TextArea size="3" variant="surface" mt="6" mb="6" className="h-[200px]" defaultValue={terms} readOnly />

                <Flex direction="column" gap="6">
                    <Flex justify="between" align="center">
                        <Text>Accept</Text>
                        <Switch defaultChecked size="3" radius="full" />
                    </Flex>
                    <Button size="4" className="w-full" onClick={onAccept} >Start</Button>
                </Flex>
            </Flex>
        </Flex >
    );
}