import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { Forms, General } from "@vendetta/ui/components";
import openMediaModal from "../lib/utils/openMediaModal";
import StealButtons from "../ui/components/StealButtons";

const MessageEmojiActionSheet = findByProps("GuildDetails");
const { FormDivider } = Forms;
const { TouchableOpacity } = General;

export default () => after("default", MessageEmojiActionSheet, ([{ emojiNode }]: [{ emojiNode: EmojiNode }], res) => {
    if (!emojiNode.src) return;

    const EmojiDetails = res?.props?.children?.props?.children?.props?.children;
    if (!EmojiDetails) return;

    const unpatchEmojiDetails = after("type", EmojiDetails, ([{ emojiNode }]: [{ emojiNode: EmojiNode }], res) => {
        React.useEffect(() => () => void unpatchEmojiDetails(), [])

        // Open the media modal when the emote is pressed
        const emoteDetails = res?.props?.children?.[0]?.props?.children;
        if (emoteDetails?.[0]?.type?.Sizes) {
            emoteDetails[0] = (
                <TouchableOpacity onPress={() => openMediaModal(emojiNode.src.split("?")[0])}>
                    {emoteDetails[0]}
                </TouchableOpacity>
            )
        }

        // Append to the Add to Favorites button if it exists
        const buttonView = res?.props?.children?.[3]?.props?.children;
        if (buttonView) {
            buttonView.push(<StealButtons emojiNode={emojiNode} />);
            return;
        }

        // Append to Join Server / Get Nitro button if it exists, otherwise append to the bottom
        const existingButtonIndex = res.props?.children?.findIndex?.(x => x?.type?.name === "Button");
        const insertIndex = -~existingButtonIndex || -2;

        res.props?.children?.splice(insertIndex, 0, <>
            <FormDivider style={{ marginLeft: 0, marginTop: 16 }} />
            <StealButtons emojiNode={emojiNode} />
        </>);
    });
});
