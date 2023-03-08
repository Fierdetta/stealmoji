import { find } from "@vendetta/metro";
import { after, before } from "@vendetta/patcher";
import { React, ReactNative as RN } from "@vendetta/metro/common";
import openEmojiActionSheet from "../lib/utils/openEmojiActionSheet";

const { default: ActionSheet } = find(m => m.default?.render?.name === "ActionSheet");

export default () => before("render", ActionSheet, ([props]) => {
    // Checks if the action sheet is for message reactions
    if (!props?.header?.props?.reactions || props.children.type?.name !== "FastList") return;

    // Patch the header
    const unpatchReactionsHeader = after("type", props.header, (_, res) => {
        // Unpatch on unmount
        React.useEffect(() => unpatchReactionsHeader as () => void, []);

        try {
            const tabsRow = res.props.children[0];
            const { tabs, onSelect } = tabsRow.props;

            // Wrap the tabs in a TouchableOpacity so we can add a long press handler
            tabsRow.props.tabs = tabs.map((tab) => (
                <RN.TouchableOpacity
                    onPress={() => onSelect(tab.props.index)}
                    onLongPress={() => {
                        const { emoji } = tab.props.reaction;
                        openEmojiActionSheet(emoji);
                    }}
                >
                    {tab}
                </RN.TouchableOpacity>
            ));
        } catch {
            console.error("Failed to patch reaction header");
        }
    });
});