'use client'

const AudioUpload = () => {
  // 音频上传的实际代码
  return (
    <div>
      <h2>音频上传</h2>
      {/* 在这里添加音频上传的表单和逻辑 */}
      <form>
        <input type="file" accept="audio/*" />
        <button type="submit">上传</button>
      </form>
    </div>
  );
};

export default AudioUpload;
