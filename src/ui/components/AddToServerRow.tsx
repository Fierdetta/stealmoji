import { findByDisplayName, findByProps } from "@vendetta/metro";
import { showInputAlert } from "@vendetta/ui/alerts";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import fetchImageAsDataURL from "../../lib/utils/fetchImageAsDataURL";

const { default: GuildIcon, GuildIconSizes } = findByProps("GuildIconSizes");
const Icon = findByDisplayName("Icon");
const { FormRow } = Forms;

const Emojis = findByProps("uploadEmoji");
const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

export default function AddToServerRow({ guild, emojiNode }) {
    const addToServerCallback = () => {
        showInputAlert({
            title: "Emoji name",
            initialValue: emojiNode.alt,
            placeholder: "bleh",
            onConfirm: (name) => {
                // Fetch image
                fetchImageAsDataURL(emojiNode.src, (dataUrl) => {
                    // Upload it to Discord
                    Emojis.uploadEmoji({
                        guildId: guild.id,
                        image: dataUrl,
                        name: name,
                        roles: undefined
                    }).then(() => {
                        // Let user know it was added
                        showToast(`Added ${emojiNode.alt} to ${guild.name}`, getAssetIDByName("Check"));
                    });
                });
            },
            confirmText: `Add to ${guild.name}`,
            confirmColor: undefined,
            cancelText: "Cancel"
        })
        // Close the sheet
        LazyActionSheet.hideActionSheet();
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
        trailing={<Icon source={getAssetIDByName("ic_add_24px")} />}
        onPress={addToServerCallback}
    />)
}