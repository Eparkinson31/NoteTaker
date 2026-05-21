import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";

type PageHeaderProps = {
  leftNode?: JSX.Element;
  rightNode?: JSX.Element;
  headerText?: string;
  handleOnPressLeftNode?: (event: GestureResponderEvent) => void;
  handleOnPressRightNode?: (event: GestureResponderEvent) => void;
  rightContainerStyle?: ViewProps["style"] | null;
  leftContainerStyle?: ViewProps["style"] | null;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  leftNode = null,
  rightNode = null,
  headerText = "",
  handleOnPressLeftNode = null,
  handleOnPressRightNode = null,
  rightContainerStyle = null,
  leftContainerStyle = null,
}) => {
  return (
    <View style={styles.pageHeaderContainer}>
      <Pressable
        onPress={handleOnPressLeftNode}
        style={leftContainerStyle || styles.leftItem}
      >
        {leftNode}
      </Pressable>
      <View style={styles.headerItem}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>{headerText}</Text>
          <Ionicons name="pencil-outline" size={30} color="#b03924" />
        </View>
      </View>
      <Pressable
        onPress={handleOnPressRightNode}
        style={rightContainerStyle || styles.rightItem}
      >
        {rightNode}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pageHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#bdcfd3",
    backgroundColor: "#bdcfd3",
  },

  leftItem: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 16,
  },

  rightItem: {
    flex: 1,
    paddingRight: 16,
    paddingVertical: 16,
    alignItems: "flex-end",
  },

  headerItem: {
    flex: 1,
    paddingVertical: 16,
  },

  headerText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    color: "#fffcf2",
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});

export default PageHeader;
