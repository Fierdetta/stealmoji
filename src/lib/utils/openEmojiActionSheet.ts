import { findByProps } from "@vendetta/metro";

const LazyActionSheet = findByProps("hideActionSheet");
const MessageEmojiActionSheet = findByProps("GuildDetails");

export default function openEmojiActionSheet({ id, name, animated }) {
    try {
        LazyActionSheet.openLazy(
            Promise.resolve(MessageEmojiActionSheet),
            "MessageEmojiActionSheet",
            {
                emojiNode: id ? {
                    id: id,
                    alt: name,
                    src: `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "webp"}?size=128`,
                } : {
                    content: name,
                    surrogate: name,
                }
            }
        );
    } catch (err) {
        console.log("Failed to open action sheet", err);
    }
}