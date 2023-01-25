import { findByProps } from "@vendetta/metro";
import { before, after } from "@vendetta/patcher";
import { FormDivider } from "@vendetta/ui/components/Forms";
import StealButtons from "./components/StealButtons";

const LazyActionSheet = findByProps("openLazy", "hideActionSheet");

let unpatch;

export default {
  onLoad: () => {
    unpatch = before("openLazy", LazyActionSheet, ([component, sheet]) => {
      // We only want to patch the emoji action sheet
      if (sheet !== "MessageEmojiActionSheet") return;
      
      // in we go!
      component.then((instance) => {
        // Patch the instance
        const unpatchInstance = after("default", instance, ([{ emojiNode }], res) => {
          // Unpatch it
          unpatchInstance();
          // Don't do anything if the emoji doesn't have a image url
          if (!emojiNode.src) return;

          // Contains everything about the emoji
          const EmojiInfo = res?.props?.children?.props?.children?.props?.children;
          // Obviously we don't want to patch if this isn't a thing
          if (!EmojiInfo) return;

          // Patch EmojiInfo
          const unpatchEmojiInfo = after("type", EmojiInfo, ([{ emojiNode }], res) => {
            // Unpatch on unmount
            React.useEffect(() => {
              return unpatchEmojiInfo;
            }, []);

            // Append to the Add to Favorites button if it exists
            const buttonView = res.props?.children[3]?.props?.children;
            if (buttonView) {
              buttonView.push(<StealButtons emojiNode={emojiNode} />);
              return;
            }

            // Append to Join Server / Get Nitro button if it exists
            const unjoinedButtonView = res.props?.children.findIndex(x => x?.type?.name === "Button");
            if (unjoinedButtonView !== -1) {
              res.props?.children?.splice(unjoinedButtonView + 1, 0, <StealButtons emojiNode={emojiNode} />);
              return;
            }
            
            // Otherwise we just add our own section with the buttons 
            res.props?.children?.splice(-2, 0, <>
              <FormDivider style={{ marginLeft: 0, marginTop: 16 }} />
              <StealButtons emojiNode={emojiNode} />
            </>);
          })
        })
      });
    });
  },

  onUnload: () => {
    unpatch();
  },
};
