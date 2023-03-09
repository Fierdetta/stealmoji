import { findByProps } from "@vendetta/metro";
import { React, ReactNative as RN } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { Forms } from "@vendetta/ui/components";
import openMediaModal from "../lib/utils/openMediaModal";
import StealButtons from "../ui/components/StealButtons";

const MessageEmojiActionSheet = findByProps("GuildDetails");
const { FormDivider } = Forms;

export default () => after("default", MessageEmojiActionSheet, ([{ emojiNode }]: [{ emojiNode: EmojiNode }], res) => {
    if (!emojiNode.src) return;

    const EmojiDetails = res?.props?.children?.props?.children?.props?.children
    const unpatchEmojiDetails = after("type", EmojiDetails, ([{ emojiNode }]: [{ emojiNode: EmojiNode }], res) => {
        React.useEffect(() => () => { unpatchEmojiDetails() }, [])

        // Open the media modal when the emote is pressed
        const emoteDetails = res.props?.children[0]?.props?.children;
        if (emoteDetails && emoteDetails[0].type.name === "Icon") {
            emoteDetails[0] = (
                <RN.TouchableOpacity onPress={() => openMediaModal(emojiNode.src.replace(/\?size=\d+/, ""))}>
                    {emoteDetails[0]}
                </RN.TouchableOpacity>
            )
        }

        // Append to the Add to Favorites button if it exists
        const buttonView = res.props?.children[3]?.props?.children;
        if (buttonView) {
            buttonView.push(<StealButtons emojiNode={emojiNode} />);
            return;
        }

        // Append to Join Server / Get Nitro button if it exists, otherwise append to the bottom
        const existingButtonIndex = res.props?.children.findIndex(x => x?.type?.name === "Button");
        const insertIndex = -~existingButtonIndex || -2;

        res.props?.children?.splice(insertIndex, 0, <>
            <FormDivider style={{ marginLeft: 0, marginTop: 16 }} />
            <StealButtons emojiNode={emojiNode} />
        </>);
    });
});
