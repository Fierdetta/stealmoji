import { findByProps } from "@vendetta/metro";
import { ReactNative } from "@vendetta/metro/common";

const {
    default: Button,
    ButtonColors,
    ButtonLooks,
    ButtonSizes,
} = findByProps("ButtonColors", "ButtonLooks", "ButtonSizes");

export default function StealButtons({ emojiNode }) {
    const buttons = [
        {
            text: "Add to Server",
            callback: () => { }
        },
        {
            text: "Copy URL to clipboard",
            callback: () => { }
        },
        ...ReactNative.Platform.select({
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
};
