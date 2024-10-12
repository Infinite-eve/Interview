'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'react-feather';

interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  jobType: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

const skillOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Git', 'Docker'];
const jobTypes = ['产品经理', '后台开发', '前端开发', '全栈开发', '数据分析师', 'UI/UX设计师'];

export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);

  const [newEducation, setNewEducation] = useState<Education>({ id: '', school: '', degree: '', major: '', startDate: '', endDate: '' });
  const [newProject, setNewProject] = useState<Project>({ id: '', name: '', role: '', startDate: '', endDate: '', description: '' });
  const [newExperience, setNewExperience] = useState<Experience>({ id: '', title: '', company: '', jobType: '', startDate: '', endDate: '', description: '' });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEducation = () => {
    if (newEducation.school && newEducation.degree && newEducation.major && newEducation.startDate && newEducation.endDate) {
      setEducation([...education, { ...newEducation, id: Date.now().toString() }]);
      setNewEducation({ id: '', school: '', degree: '', major: '', startDate: '', endDate: '' });
    }
  };

  const addProject = () => {
    if (newProject.name && newProject.role && newProject.startDate && newProject.endDate && newProject.description) {
      setProjects([...projects, { ...newProject, id: Date.now().toString() }]);
      setNewProject({ id: '', name: '', role: '', startDate: '', endDate: '', description: '' });
    }
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company && newExperience.jobType && newExperience.startDate && newExperience.endDate && newExperience.description) {
      setExperience([...experience, { ...newExperience, id: Date.now().toString() }]);
      setNewExperience({ id: '', title: '', company: '', jobType: '', startDate: '', endDate: '', description: '' });
    }
  };

  const deleteItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, id: string) => {
    setter((prev) => prev.filter(item => item.id !== id));
  };

  const editItem = (setter: React.Dispatch<React.SetStateAction<any[]>>, id: string, updatedItem: any) => {
    setter((prev) => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">个人资料</h1>

      {/* 头像上传 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">头像</h2>
        <div className="flex items-center space-x-4">
          {avatar && <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-full" />}
          <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload" />
          <label htmlFor="avatar-upload" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
            上传头像
          </label>
        </div>
      </div>

      {/* 教育背景 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">教育背景</h2>
        {education.map((edu) => (
          <div key={edu.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-2 flex justify-between items-center">
            <div>
              <p className="font-semibold">{edu.school} - {edu.degree} in {edu.major}</p>
              <p>{edu.startDate} - {edu.endDate}</p>
            </div>
            <div>
              <button onClick={() => editItem(setEducation, edu.id, { ...edu })} className="text-blue-500 hover:text-blue-700 mr-2">
                <Edit2 size={18} />
              </button>
              <button onClick={() => deleteItem(setEducation, edu.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="学校"
            value={newEducation.school}
            onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="学位"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="专业"
            value={newEducation.major}
            onChange={(e) => setNewEducation({ ...newEducation, major: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newEducation.startDate}
            onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newEducation.endDate}
            onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
            className="p-2 border rounded"
          />
          <button onClick={addEducation} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            添加
          </button>
        </div>
      </div>

      {/* 技能 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">技能</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill) => (
            <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {skill}
              <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="ml-2 text-red-500 hover:text-red-700">
                &times;
              </button>
            </span>
          ))}
        </div>
        <select
          onChange={(e) => {
            if (e.target.value && !skills.includes(e.target.value)) {
              setSkills([...skills, e.target.value]);
            }
          }}
          className="p-2 border rounded"
        >
          <option value="">选择技能</option>
          {skillOptions.filter(skill => !skills.includes(skill)).map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* 项目经历 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">项目经历</h2>
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-2 flex justify-between items-start">
            <div>
              <p className="font-semibold">{project.name} - {project.role}</p>
              <p>{project.startDate} - {project.endDate}</p>
              <p>{project.description}</p>
            </div>
            <div>
              <button onClick={() => editItem(setProjects, project.id, { ...project })} className="text-blue-500 hover:text-blue-700 mr-2">
                <Edit2 size={18} />
              </button>
              <button onClick={() => deleteItem(setProjects, project.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="项目名称"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="角色"
            value={newProject.role}
            onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newProject.startDate}
            onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newProject.endDate}
            onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="项目描述"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="p-2 border rounded col-span-2"
            rows={3}
          />
          <button onClick={addProject} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-2">
            添加项目
          </button>
        </div>
      </div>

      {/* 工作经历 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">工作经历</h2>
        {experience.map((exp) => (
          <div key={exp.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-2 flex justify-between items-start">
            <div>
              <p className="font-semibold">{exp.title} at {exp.company}</p>
              <p>{exp.jobType}</p>
              <p>{exp.startDate} - {exp.endDate}</p>
              <p>{exp.description}</p>
            </div>
            <div>
              <button onClick={() => editItem(setExperience, exp.id, { ...exp })} className="text-blue-500 hover:text-blue-700 mr-2">
                <Edit2 size={18} />
              </button>
              <button onClick={() => deleteItem(setExperience, exp.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="职位"
            value={newExperience.title}
            onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="公司"
            value={newExperience.company}
            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={newExperience.jobType}
            onChange={(e) => setNewExperience({ ...newExperience, jobType: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">选择岗位类型</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="date"
            value={newExperience.startDate}
            onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newExperience.endDate}
            onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="工作描述"
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
            className="p-2 border rounded col-span-2"
            rows={3}
          />
          <button onClick={addExperience} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-2">
            添加工作经历
          </button>
        </div>
      </div>

      <button
        onClick={() => console.log({ avatar, education, skills, projects, experience })}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        保存个人资料
      </button>
    </div>
  );
}