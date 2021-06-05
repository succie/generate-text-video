<script lang="ts">
  import html2canvas from 'html2canvas';
  import { createFFmpeg } from '@ffmpeg/ffmpeg';

  const ffmpeg = createFFmpeg();

  let text: string = 'ここにテキスト';
  let textColor: string = '#fff';
  let backgroundColor: string = '#000';

  let preview: HTMLDivElement;

  const onClick = async () => {
    const canvas = await html2canvas(preview);
    await ffmpeg.load();
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
        '15',
        '-pix_fmt',
        'yuv420p',
        '-vf',
        'scale=320:240',
        'out.mp4'
      );

      const data = ffmpeg.FS('readFile', 'out.mp4');

      const link: HTMLAnchorElement = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([data]));
      link.download = 'out.mp4';
      link.click();
    });
  };
</script>

<section>
  <input type="text" bind:value={text} />
  <input type="text" bind:value={backgroundColor} />
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

<style>
  .preview {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 640px;
    height: 360px;
  }
</style>
