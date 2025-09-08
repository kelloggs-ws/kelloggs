import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Button } from "@chakra-ui/react";
export default function TestChakra() {
    return (_jsx(Box, { bg: "gray.200", p: 6, children: _jsx(Button, { colorScheme: "blue", children: "Hello Chakra" }) }));
}
