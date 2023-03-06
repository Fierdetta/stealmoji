import patchMessageEmojiActionSheet from "./patches/MessageEmojiActionSheet";

let patches = [];

export default {
    onLoad: () => {
        patches.push(patchMessageEmojiActionSheet());
    },
    onUnload: () => {
        for (const unpatch of patches) {
            unpatch();
        };
    },
}