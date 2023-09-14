import { LazyActionSheet, Surrogates } from "../../modules";
import { MessageEmojiActionSheet } from "../../patches/MessageEmojiActionSheet";

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
                    content: Surrogates.convertSurrogateToName(name),
                    surrogate: name,
                }
            }
        );
    } catch (err) {
        console.log("Failed to open action sheet", err);
    }
}