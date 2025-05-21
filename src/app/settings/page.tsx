'use client';
import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    analysisDepth: '標準',
    notifications: true,
    saveHistory: true,
    language: '日本語',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Settings save process (to be implemented later)
    console.log('設定保存:', settings);
    alert('設定が保存されました');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">設定</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              分析の詳細度
            </label>
            <div className="flex space-x-4">
              {['簡易', '標準', '詳細'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="analysisDepth"
                    checked={settings.analysisDepth === option}
                    onChange={() => setSettings({...settings, analysisDepth: option})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 bg-gray-700"
                  />
                  <span className="ml-2 text-gray-300">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">通知設定</h3>
            
            <div className="flex items-center justify-between">
              <label htmlFor="notifications" className="text-gray-300">
                通知を受け取る
              </label>
              <div className="relative inline-block w-10 align-middle select-none">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.notifications}
                  onChange={() => setSettings({...settings, notifications: !settings.notifications})}
                  className="sr-only peer"
                />
                <div className="block h-6 bg-gray-600 rounded-full w-10 peer-checked:bg-blue-600"></div>
                <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-5 transition-all"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="saveHistory" className="text-gray-300">
                検索履歴を保存する
              </label>
              <div className="relative inline-block w-10 align-middle select-none">
                <input
                  type="checkbox"
                  id="saveHistory"
                  checked={settings.saveHistory}
                  onChange={() => setSettings({...settings, saveHistory: !settings.saveHistory})}
                  className="sr-only peer"
                />
                <div className="block h-6 bg-gray-600 rounded-full w-10 peer-checked:bg-blue-600"></div>
                <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-5 transition-all"></div>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
              言語
            </label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="日本語">日本語</option>
              <option value="English">English</option>
            </select>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              設定を保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 