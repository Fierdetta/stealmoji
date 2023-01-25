import { findByProps } from "@vendetta/metro";
import { Platform } from "@vendetta/metro/common/ReactNative";
import { setString, setImage } from "@vendetta/metro/common/clipboard";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import fetchImageAsDataURL from "../functions/fetchImageAsDataURL";

const {
	default: Button,
	ButtonColors,
	ButtonLooks,
	ButtonSizes,
} = findByProps("ButtonColors", "ButtonLooks", "ButtonSizes");
const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

const CopyMessageLink = getAssetIDByName("ic_copy_message_link");
const CopyFile = getAssetIDByName('ic_message_copy');

export default function StealButtons({ emojiNode }) {
	console.log(emojiNode)
	const buttons = [
		{
			text: "Add to Server",
			callback: () => { }
		},
		{
			text: "Copy URL to clipboard",
			callback: () => {
				setString(emojiNode.src);
				LazyActionSheet.hideActionSheet();
				showToast(`Copied ${emojiNode.alt}'s URL to clipboard`, CopyMessageLink);
			}
		},
		...Platform.select({
			ios: [
				{
					text: "Copy image to clipboard",
					callback: () => fetchImageAsDataURL(emojiNode.src, (dataUrl) => {
						setImage(dataUrl.split(',')[1]);
						LazyActionSheet.hideActionSheet();
						showToast(`Copied ${emojiNode.alt}'s image to clipboard`, CopyFile);
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
}
