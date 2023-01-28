import { find, findByProps } from "@vendetta/metro";
import { Permissions } from "@vendetta/metro/common/constants";
import { FormDivider } from "@vendetta/ui/components/Forms";
import AddToServerRow from "../components/AddToServerRow";

const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

// Components
const ActionSheet = find((m) => m.default && m.default.render && m.default.render.name == "ActionSheet").default.render;
const { BottomSheetScrollView } = findByProps("BottomSheetScrollView");

// Stores
const GuildStore = findByProps("getGuilds");
const PermissionsStore = findByProps("can", "_dispatcher");

// function to easily show the sheet
export function showAddToServerActionSheet(emojiNode) {
	LazyActionSheet.openLazy(() => Promise.resolve(AddToServerActionSheet), "AddToServerActionSheet", { emojiNode: emojiNode });
};

// The sheet itself
export default function AddToServerActionSheet({ emojiNode }) {
	// Get guilds as a Array of ID and value pairs, and filter out guilds the user can't edit emojis in
	const guilds = Object.entries(GuildStore.getGuilds()).filter(([_, guild]) => PermissionsStore.can(Permissions.MANAGE_GUILD_EXPRESSIONS, guild));

	return (<ActionSheet>
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
