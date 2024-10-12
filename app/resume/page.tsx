import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ResumePage() {
  const { data: session } = useSession();
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    // 从API获取简历数据
    if (session?.user?.id) {
      fetch(`/api/resume/${session.user.id}`)
        .then(res => res.json())
        .then(data => setResumeData(data));
    }
  }, [session]);

  // 渲染简历编辑表单
  return (
    // ...
  );
}