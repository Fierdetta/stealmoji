import { findByProps } from "@vendetta/metro";
import { clipboard, ReactNative } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import fetchImageAsDataURL from "../../lib/utils/fetchImageAsDataURL";
import { showAddToServerActionSheet } from "../sheets/AddToServerActionSheet";

const {
    default: Button,
    ButtonColors,
    ButtonLooks,
    ButtonSizes,
} = findByProps("ButtonColors", "ButtonLooks", "ButtonSizes");

const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

export default function StealButtons({ emojiNode }) {
    const buttons = [
        {
            text: "Add to Server",
            callback: () => showAddToServerActionSheet(emojiNode)
        },
        {
            text: "Copy URL to clipboard",
            callback: () => {
                clipboard.setString(emojiNode.src);
                LazyActionSheet.hideActionSheet();
                showToast(`Copied ${emojiNode.alt}'s URL to clipboard`, getAssetIDByName("ic_copy_message_link"));
            }
        },
        ...ReactNative.Platform.select({
            ios: [
                {
                    text: "Copy image to clipboard",
                    callback: () => fetchImageAsDataURL(emojiNode.src, (dataUrl) => {
                        clipboard.setImage(dataUrl.split(',')[1]);
                        LazyActionSheet.hideActionSheet();
                        showToast(`Copied ${emojiNode.alt}'s image to clipboard`, getAssetIDByName("ic_message_copy"));
                    })
                }
            ],
            default: []
        })

    ]
    return <>
        {buttons.map(({ text, callback }) =>
            <Button
                color={ButtonColors.BRAND}
                text={text}
                size={ButtonSizes.SMALL}
                onPress={callback}
                style={{ marginTop: 16 }}
            />
        )
        }
    </>
};
