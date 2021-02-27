import React, { useCallback, useState, useRef } from "react";
import { DefaultLayouts } from "../templates";
import { Button } from "../atoms";
import { Box, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

const Room = () => {
  const [messages, setMessages] = useState<string[]>(["aaaa", "bbbb", "cccc"]);
  const messageRef = useRef("");

  const handleClick = useCallback(() => {
    setMessages([...messages, messageRef.current]);
  }, [messages]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      messageRef.current = e.target.value;
    },
    []
  );

  return (
    <DefaultLayouts>
      <Box position="relative" height="100vh" width="100%">
        <Box
          height="90vh"
          width="100%"
          position="absolute"
          bottom="0"
          bgcolor="#fff"
          borderRadius="25px 25px 0 0"
          boxShadow="0 3px 6px -2px rgb(0 10 60 / 20%)"
        >
          icons
          <Box>
            {messages.map((message) => (
              <Box bgcolor="#fff">{message}</Box>
            ))}
          </Box>
        </Box>
        <Box
          position="absolute"
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          width="100%"
          bottom="0"
          bgcolor="#fff"
          boxShadow="0 -3px 6px -2px rgb(0 10 60 / 20%)"
          pt={2}
          pb={2}
        >
          <TextField
            id="chat"
            type="text"
            multiline={true}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="default"
            endIcon={<SendIcon />}
            onClick={handleClick}
          >
            送信
          </Button>
        </Box>
      </Box>
    </DefaultLayouts>
  );
};

export default Room;
