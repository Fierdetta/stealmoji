import { find, findByProps } from "@vendetta/metro";
import { constants } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import AddToServerRow from "../components/AddToServerRow";

const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

const ActionSheet = find(m => m.render?.name === "ActionSheet");
const { BottomSheetFlatList } = findByProps("BottomSheetScrollView");
const { ActionSheetTitleHeader, ActionSheetCloseButton } = findByProps("ActionSheetTitleHeader");
const { FormDivider, FormIcon } = Forms;

const GuildStore = findByProps("getGuilds");
const PermissionsStore = findByProps("can", "_dispatcher");

// The sheet itself
export default function AddToServerActionSheet({ emojiNode }: { emojiNode: EmojiNode }) {
    // Get guilds as a Array of ID and value pairs, and filter out guilds the user can't edit emojis in
    const guilds = Object.values(GuildStore.getGuilds()).filter((guild) =>
        PermissionsStore.can(constants.Permissions.MANAGE_GUILD_EXPRESSIONS, guild)
    );

    return (
        <ActionSheet scrollable>
            <ActionSheetTitleHeader
                title={`Stealing ${emojiNode.alt}`}
                leading={<FormIcon
                    style={{ marginRight: 12, opacity: 1 }}
                    source={{ uri: emojiNode.src }}
                    disableColor // It actually does the opposite
                />}
                trailing={<ActionSheetCloseButton
                    onPress={() => LazyActionSheet.hideActionSheet()}
                />}
            />
            <BottomSheetFlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 24 }}
                data={guilds}
                renderItem={({ item }) => (
                    <AddToServerRow
                        guild={item}
                        emojiNode={emojiNode}
                    />
                )}
                ItemSeparatorComponent={FormDivider}
                keyExtractor={x => x.id}
            />
        </ActionSheet>
    )
};
