import { find, findByProps } from "@vendetta/metro";
import { constants } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import AddToServerRow from "../components/AddToServerRow";

const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

const ActionSheet = find((m) => m.default && m.default.render && m.default.render.name == "ActionSheet").default.render;
const { BottomSheetScrollView } = findByProps("BottomSheetScrollView");
const { FormDivider } = Forms;

const GuildStore = findByProps("getGuilds");
const PermissionsStore = findByProps("can", "_dispatcher");

// function to show the sheet
export const showAddToServerActionSheet = (emojiNode) => LazyActionSheet.openLazy(new Promise(r => r({ default: AddToServerActionSheet })), "AddToServerActionSheet", { emojiNode: emojiNode });

// The sheet itself
export default function AddToServerActionSheet({ emojiNode }) {
    // Get guilds as a Array of ID and value pairs, and filter out guilds the user can't edit emojis in
    const guilds = Object.entries(GuildStore.getGuilds()).filter(([_, guild]) => PermissionsStore.can(constants.Permissions.MANAGE_GUILD_EXPRESSIONS, guild));

    return (<ActionSheet scrollable>
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 16 }}>
            {guilds.map(([_, guild], num) =>
                <>
                    <AddToServerRow guild={guild} emojiNode={emojiNode} />
                    {num !== guilds.length - 1 && <FormDivider />}
                </>
            )}
        </BottomSheetScrollView>
    </ActionSheet>)
};
