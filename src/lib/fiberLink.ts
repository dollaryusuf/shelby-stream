import { getShelbyClient } from './shelby';

/**
 * Fiber-Link Middleware
 * Translates a Shelby blob_id into a ReadableStream compatible with standard HTML5 video elements.
 */
export const createFiberStream = (blobId: string, totalSize: number = 100 * 1024 * 1024) => {
  const client = getShelbyClient();
  const chunkSize = 1024 * 1024; // 1MB chunks
  let offset = 0;

  return new ReadableStream({
    async pull(controller) {
      if (offset >= totalSize) {
        controller.close();
        return;
      }

      try {
        const size = Math.min(chunkSize, totalSize - offset);
        const chunk = await client.getBlobChunk(blobId, offset, size);
        
        controller.enqueue(chunk);
        offset += size;
        
        console.log(`Fiber-Link: Streamed ${offset}/${totalSize} bytes for ${blobId}`);
      } catch (error) {
        console.error('Fiber-Link: Stream error:', error);
        controller.error(error);
      }
    },
    cancel() {
      console.log(`Fiber-Link: Stream canceled for ${blobId}`);
    }
  });
};

/**
 * Utility to create a MediaSource URL from a Shelby blob_id
 */
export const attachFiberToVideo = (videoElement: HTMLVideoElement, blobId: string, totalSize: number = 100 * 1024 * 1024) => {
  const mediaSource = new MediaSource();
  const url = URL.createObjectURL(mediaSource);
  videoElement.src = url;

  mediaSource.addEventListener('sourceopen', async () => {
    const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    const stream = createFiberStream(blobId, totalSize);
    const reader = stream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        mediaSource.endOfStream();
        break;
      }

      // Wait for the buffer to be ready
      if (sourceBuffer.updating) {
        await new Promise(resolve => sourceBuffer.addEventListener('updateend', resolve, { once: true }));
      }

      sourceBuffer.appendBuffer(value);
    }
  });

  return () => {
    URL.revokeObjectURL(url);
    videoElement.src = '';
  };
};
