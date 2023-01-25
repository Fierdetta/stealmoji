import { findByProps } from "@vendetta/metro";
import { Platform } from "@vendetta/metro/common/ReactNative";
import { setString } from "@vendetta/metro/common/clipboard";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";

const {
	default: Button,
	ButtonColors,
	ButtonLooks,
	ButtonSizes,
} = findByProps("ButtonColors", "ButtonLooks", "ButtonSizes");
const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

const CopyMessageLink = getAssetIDByName("ic_copy_message_link") 

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
					callback: () => { }
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
