<script lang="ts">
  import html2canvas from 'html2canvas';
  import { createFFmpeg } from '@ffmpeg/ffmpeg';

  const qualityList = ['144' , '240' , '360' , '720' , '1080'] as const;
  type Quality = typeof qualityList[number];

  const ffmpeg = createFFmpeg();

  let text: string = 'ここにテキスト';
  let textColor: string = '#fff';
  let backgroundColor: string = '#000';
  let duration: number = 15;
  let quality: Quality = '240';

  let preview: HTMLDivElement;
  let downloadButton: HTMLButtonElement;

  let filename: string;
  let data: Uint8Array | null = null;

  const getScale = (quality: Quality) => {
    switch (quality) {
      case '144': {
        return '256:144';
      }
      case '240': {
        return '427:240';
      }
      case '360': {
        return '640:360';
      }
      case '720': {
        return '1280:720';
      }
      case '1080': {
        return '1920:1080';
      }
    }
  };

  const onClick = async () => {
    const canvas = await html2canvas(preview);

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    canvas.toBlob(async (blob) => {
      if (!blob) throw new Error('blob');

      ffmpeg.FS(
        'writeFile',
        'image.png',
        new Uint8Array(await blob.arrayBuffer())
      );

      await ffmpeg.run(
        '-loop',
        '1',
        '-i',
        'image.png',
        '-c:v',
        'libx264',
        '-t',
        duration.toString(),
        '-pix_fmt',
        'yuv420p',
        '-vf',
        `scale=${getScale(quality)}`,
        'out.mp4'
      );

      data = ffmpeg.FS('readFile', 'out.mp4');

      downloadButton.disabled = false;
    });
  };

  const onDownload = () => {
    if (!data) {
      return;
    }

    const link: HTMLAnchorElement = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([data]));
    link.download = `${filename || 'out'}.mp4`;
    link.click();
    data = null;
  };
</script>

<section>
  <input type="text" bind:value={text} />
  <input type="text" bind:value={backgroundColor} />
  <input type="number" bind:value={duration} />
  <select bind:value={quality}>
    {#each qualityList as q}
      <option value={q}>{q}p</option>
    {/each}
  </select>
  <button on:click={onClick}>GENERATE</button>
</section>

<section>
  <div
    class="preview"
    style={`color: ${textColor}; background-color: ${backgroundColor}`}
    bind:this={preview}
  >
    {text}
  </div>
</section>

<section>
  <input type="text" placeholder="filename" bind:value={filename} />
  <button on:click={onDownload} bind:this={downloadButton} disabled>
    DOWNLOAD
  </button>
</section>

<style>
  .preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 640px;
    height: 360px;
  }
</style>
