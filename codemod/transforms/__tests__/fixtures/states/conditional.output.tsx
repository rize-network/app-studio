import { View } from "app-studio";
export const Link = ({ active }) => <View
  as="a"
  color={active ? "color-blue-500" : "color-coolGray-500"}
  _hover={{
    ...(active ? {
      textDecorationLine: "underline"
    } : {})
  }} />;
