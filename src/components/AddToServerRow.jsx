import { findByDisplayName, findByProps } from "@vendetta/metro";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { FormRow } from "@vendetta/ui/components/Forms";
import { showToast } from "@vendetta/ui/toasts";
import fetchImageAsDataURL from "../functions/fetchImageAsDataURL";

// Components
const { default: GuildIcon, GuildIconSizes } = findByProps("GuildIconSizes");
const Icon = findByDisplayName("Icon");

// Misc
const Emojis = findByProps("uploadEmoji");
const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

const Add = getAssetIDByName("ic_add_24px");
const Checkmark = getAssetIDByName("Check");

export default function AddToServerRow({ guild, emojiNode }) {
	const addToServerCallback = () => {
		// Fetch image
		fetchImageAsDataURL(emojiNode.src, (dataUrl) => {
			// Upload it to Discord
			Emojis.uploadEmoji({
				guildId: guild.id,
				image: dataUrl,
				name: emojiNode.alt,
				roles: undefined
			}).then(() => {
				// Let user know it was added
				showToast(`Added ${emojiNode.alt} to ${guild.name}`, Checkmark);
				// Close the sheet
				LazyActionSheet.hideActionSheet();
			});
		});
	};

	return (<FormRow
		leading={
			<GuildIcon
				guild={guild}
				size={GuildIconSizes.LARGE}
				animate={false}
			/>
		}
		label={guild.name}
		trailing={<Icon source={Add} />}
		onPress={addToServerCallback}
	/>)
}
