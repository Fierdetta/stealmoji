import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";
import { Forms } from "@vendetta/ui/components";
import StealButtons from "../ui/components/StealButtons";

const MessageEmojiActionSheet = findByProps("GuildDetails");
const { FormDivider } = Forms;

export default () => after("default", MessageEmojiActionSheet, ([{ emojiNode }], res) => {
    if (!emojiNode.src) return;

    const EmojiDetails = res?.props?.children?.props?.children?.props?.children
    const unpatchEmojiDetails = after("type", EmojiDetails, ([{ emojiNode }], res) => {
        React.useEffect(() => () => { unpatchEmojiDetails() }, [])

        // Append to the Add to Favorites button if it exists
        const buttonView = res.props?.children[3]?.props?.children;
        if (buttonView) {
            buttonView.push(<StealButtons emojiNode={emojiNode} />);
            return;
        }

        // Append to Join Server / Get Nitro button if it exists
        const unjoinedButtonView = res.props?.children.findIndex(x => x?.type?.name === "Button");
        if (unjoinedButtonView !== -1) {
            res.props?.children?.splice(unjoinedButtonView + 1, 0, <StealButtons emojiNode={emojiNode} />);
            return;
        }

        // Otherwise we just add our own section with the buttons 
        res.props?.children?.splice(-2, 0, <>
            <FormDivider style={{ marginLeft: 0, marginTop: 16 }} />
            <StealButtons emojiNode={emojiNode} />
        </>);

    });
});
