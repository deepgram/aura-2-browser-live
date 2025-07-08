async function startAudio() {
  const context = new AudioContext({ sampleRate: 24000 });
  await context.audioWorklet.addModule("pcm-processor.js");

  const workletNode = new AudioWorkletNode(context, "pcm-player-processor");
  workletNode.connect(context.destination);

  // Begin streaming PCM audio
  const response = await fetch(
    "https://api.deepgram.com/v1/speak?model=aura-2-odysseus-en&encoding=linear16&sample_rate=24000&container=none",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "token d2cd488dbb1faa84a224d5fb4b7722142adc88c9",
      },
      body: JSON.stringify({
        text: "After reviewing your auto policy, I see that you currently have comprehensive coverage with a $500 deductible. To add roadside assistance for an additional $4.25 per month, please confirm by saying 'yes' or by visiting your account online using reference number INS-48271.",
      }),
    },
  );

  const reader = response.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    if (!value) continue;

    console.log(value.byteLength);
    const alignedBuffer = value.buffer.slice(
      value.byteOffset,
      value.byteOffset + value.byteLength,
    );
    const int16 = new Int16Array(alignedBuffer);
    const float32 = new Float32Array(int16.length);

    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }

    workletNode.port.postMessage(float32);
  }
}

window.startAudio = startAudio;
