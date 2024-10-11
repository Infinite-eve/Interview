export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">欢迎使用面试复盘应用</h1>
      <p className="mb-4">
        这个应用可以帮助您上传面试音频，获取AI分析和建议，提高您的面试技巧。
      </p>
      <p>
        开始使用：
      </p>
      <ul className="list-disc list-inside ml-4">
        <li>更新您的个人资料</li>
        <li>上传面试音频</li>
        <li>查看AI分析和建议</li>
      </ul>
    </div>
  );
}
