# Aura-2 live playback in the browser

This setup uses the Audio API to support rapid playback in the browser. It consists of two main
parts:

- `main.js` sets up the audio graph, fetches audio, and streams it to the PCM processor worklet
- `pcm-processor.js`, the worklet, handles sending audio to output

## Test it out

If you have Node on your machine, run `npx serve .`

Otherwise, any simple server serving the files in this directory will do.
