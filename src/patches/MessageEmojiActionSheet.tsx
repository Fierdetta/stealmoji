import { findByProps } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { Forms, General } from "@vendetta/ui/components";
import openMediaModal from "../lib/utils/openMediaModal";
import StealButtons from "../ui/components/StealButtons";

const LazyActionSheet = findByProps("hideActionSheet");
const { FormDivider } = Forms;
const { TouchableOpacity } = General;

// Android 194204 - MessageEmojiActionSheet can't be found from findByProps("GuildDetails") anymore
// We can either patch LazyActionSheet.openLazy or ActionSheet component(?)
// In this case, patching openLazy is better to keep compatibility with the old approach
// Due to this action sheet can be only found lazily, this module can only be found/catched
// once the user opened the sheet at least once.
// This leads to some of Stealmoji features to not work.
export let MessageEmojiActionSheet = findByProps("GuildDetails");

export default () => {
    if (MessageEmojiActionSheet) return patchSheet("default", MessageEmojiActionSheet);
    
    const patches = [];
    const unpatchLazy = before("openLazy", LazyActionSheet, ([lazySheet, name]) => {
        if (name !== "MessageEmojiActionSheet") return;
        unpatchLazy();

        lazySheet.then(module => {
            MessageEmojiActionSheet = module;
            patches.push(after("default", module, (_, res) => {
                // res.type is the same as the no-longer-existing findByProps("GuildDetails").default
                patches.push(patchSheet("type", res));
            }));
        });
    });

    return () => (unpatchLazy(), patches.forEach(p => p?.()));
}

function patchSheet(funcName: string, sheetModule: any, once = false) {
    const unpatch = after(funcName, sheetModule, ([{ emojiNode }]: [{ emojiNode: EmojiNode }], res) => {
        React.useEffect(() => () => void (once && unpatch()), []);

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
    }, once);

    return unpatch;
}