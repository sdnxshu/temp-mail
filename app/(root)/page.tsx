// app/(root)/page.tsx 
import { cookies } from "next/headers";
import Link from "next/link";

import { resend } from "@/lib/resend";

const Page = async () => {

    const cookieStore = await cookies()
    const email = cookieStore.get('email')?.value || ""

    const { data: something, error } = await resend.emails.receiving.list();

    const filteredEmails = something?.data.filter((item) =>
        item.to.includes(email)
    );

    const data = {
        count: filteredEmails?.length || 0,
        emails: filteredEmails,
    };

    return (
        <div className="min-h-screen bg-[#f6f8fc]">
            <div className="max-w-5xl mx-auto py-8 px-4">

                {/* Header */}
                <div className="bg-white border rounded-xl shadow-sm mb-6">
                    <div className="px-6 py-5 border-b">
                        <h1 className="text-xl font-medium text-gray-900">
                            Inbox
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Temporary email:
                            <span className="ml-2 font-mono text-blue-600">
                                {email}
                            </span>
                        </p>
                    </div>

                    {/* Email List */}
                    <div>
                        {data?.emails?.length === 0 ? (
                            <div className="px-6 py-16 text-center text-gray-500">
                                No emails yet.
                            </div>
                        ) : (
                            data.emails?.map((mail: any) => {
                                const senderInitial =
                                    mail.from?.charAt(0).toUpperCase() ?? "?";

                                return (
                                    <Link
                                        key={mail.id}
                                        href={`/email/${mail.id}`}
                                        className="block border-b last:border-none hover:bg-gray-50 transition"
                                    >
                                        <div className="px-6 py-4 flex items-start gap-4">

                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                                                {senderInitial}
                                            </div>

                                            {/* Email Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="font-semibold text-gray-900 truncate">
                                                        {mail.from}
                                                    </h2>
                                                </div>

                                                <p className="text-sm text-gray-900 truncate">
                                                    {mail.subject || "(No subject)"}
                                                </p>

                                                <p className="text-sm text-gray-500 truncate">
                                                    {mail.body}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;