class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.port.onmessage = (event) => {
      this.buffer.push(...event.data);
    };
  }

  process(inputs, outputs) {
    const output = outputs[0];
    const channel = output[0];

    for (let i = 0; i < channel.length; i++) {
      channel[i] = this.buffer.length > 0 ? this.buffer.shift() : 0;
    }

    return true;
  }
}

registerProcessor('pcm-player-processor', PCMPlayerProcessor);
