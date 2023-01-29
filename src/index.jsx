import { find, findByProps } from "@vendetta/metro";
import { ReactNative as RN } from "@vendetta/metro/common";
import { after, before } from "@vendetta/patcher";
import { FormDivider } from "@vendetta/ui/components/Forms";
import StealButtons from "./components/StealButtons";

const MessageEmojiActionSheet = findByProps("GuildDetails");
const ActionSheet = find((m) => m.default?.render?.name == "ActionSheet")?.default;

let unpatch;
let unpatchReactions;

export default {
  onLoad: () => {
    unpatch = after("default", MessageEmojiActionSheet, ([{ emojiNode }], res) => {
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
        
        // const emoteDetails = res.props?.children[0]?.props?.children;
        // if (emoteDetails && emoteDetails[0].type.name === "Icon") {
          //   emoteDetails[0] = (
        //     <RN.TouchableOpacity onPress={() => console.log(emojiNode)}>
        //       {emoteDetails[0]}
        //     </RN.TouchableOpacity>
        //   )
        // }

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

    // Some old versions uses different kind of ActionSheet
    if (ActionSheet) {
      unpatchReactions = before("render", ActionSheet, ([props]) => {
        // Checks if the action sheet is for message reactions
        if (!props?.header?.props?.reactions || props.children.type?.name !== "FastList") return;
        
        // Patch the header
        const unpatchReactionsHeader = after("type", props.header, (args, res) => {
          // Unpatch on unmount
          React.useEffect(() => unpatchReactionsHeader, []);
    
          const tabsRow = res.props.children[0];
          const { tabs, onSelect } = tabsRow.props;
          
          // Wrap the tabs in a TouchableOpacity so we can add a long press handler
          tabsRow.props.tabs = tabs.map((tab) => (
            <RN.TouchableOpacity
              onPress={() => onSelect(tab.props.index)}
              onLongPress={() => console.log("Long pressed")}
            >
              {tab}
            </RN.TouchableOpacity>
          ));
        });
      });
    }
    
    // // Kept for future reference..?
    // before("default", findByDisplayName("v", false), ([tab]) => {
    //   const { tabs, onSelect } = tab;
  
    //   tab.tabs = tabs.map((tab) => (
    //     <RN.TouchableOpacity
    //       onPress={() => onSelect(tab.props.index)}
    //       onLongPress={() => showAddToServerActionSheet({})}
    //     >
    //       {tab}
    //     </RN.TouchableOpacity>
    //   ));
    // });
  },
  onUnload: () => {
    unpatch();
    unpatchReactions?.();
  },
};
