import { resend } from "@/lib/resend";
import {
    Reply,
    Forward,
    Paperclip,
    FileText,
    Image,
    File,
    FileArchive,
} from "lucide-react";

function getFileIcon(type?: string) {
    if (!type) return <File className="w-5 h-5 text-gray-500" />;

    if (type.startsWith("image/"))
        return <Image className="w-5 h-5 text-green-600" />;

    if (type.includes("pdf"))
        return <FileText className="w-5 h-5 text-red-600" />;

    if (type.includes("zip") || type.includes("rar"))
        return <FileArchive className="w-5 h-5 text-yellow-600" />;

    return <File className="w-5 h-5 text-gray-500" />;
}

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const { data } = await resend.emails.receiving.get(id);
    const { data: attachments } =
        await resend.emails.receiving.attachments.list({
            emailId: id,
        });

    const senderInitial =
        data?.from?.charAt(0).toUpperCase() ?? "?";

    return (
        <div className="min-h-screen bg-[#f6f8fc] py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">

                {/* Header */}
                <div className="px-6 py-5 border-b">
                    <h1 className="text-xl font-medium text-gray-900">
                        {data?.subject || "(No subject)"}
                    </h1>
                </div>

                {/* Sender Section */}
                <div className="px-6 py-4 flex items-start justify-between">
                    <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                            {senderInitial}
                        </div>

                        {/* Sender Info */}
                        <div className="text-sm">
                            <div className="font-semibold text-gray-900">
                                {data?.from}
                            </div>
                            <div className="text-gray-500">
                                to {data?.to}
                            </div>
                            {data?.cc && (
                                <div className="text-gray-400 text-xs">
                                    cc: {data?.cc}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reply / Forward */}
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 transition">
                            <Reply className="w-4 h-4" />
                            Reply
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 transition">
                            <Forward className="w-4 h-4" />
                            Forward
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6 text-gray-800 text-sm leading-relaxed border-t">
                    {data?.html ? (
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: data.html }}
                        />
                    ) : (
                        <pre className="whitespace-pre-wrap font-sans">
                            {data?.text}
                        </pre>
                    )}
                </div>

                {/* Attachments */}
                {attachments?.data?.length ? (
                    <div className="px-6 py-4 border-t bg-gray-50">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                            <Paperclip className="w-4 h-4" />
                            {attachments.data.length} Attachment
                            {attachments.data.length > 1 && "s"}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                            {attachments.data.map((attachment) => (
                                <a
                                    key={attachment.id}
                                    href={attachment.download_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition"
                                >
                                    {getFileIcon(attachment.content_type)}

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">
                                            {attachment.filename}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(attachment.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}