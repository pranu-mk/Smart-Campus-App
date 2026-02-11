import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquarePlus,
  FileText,
  HelpCircle,
  Bot,
  CheckCircle,
} from "lucide-react";

/**
 * Navigation Test Component
 * This component tests that all student dashboard buttons navigate correctly
 */
const NavigationTest = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<any>({});

  const quickActions = [
    {
      title: "Raise Complaint",
      icon: MessageSquarePlus,
      path: "/dashboard/student/raise-complaint",
      id: "raise-complaint",
    },
    {
      title: "My Complaints",
      icon: FileText,
      path: "/dashboard/student/my-complaints",
      id: "my-complaints",
    },
    {
      title: "Student Helpdesk",
      icon: HelpCircle,
      path: "/dashboard/student/helpdesk",
      id: "helpdesk",
    },
    {
      title: "Campus Chatbot",
      icon: Bot,
      path: "/dashboard/student/chatbot",
      id: "chatbot",
    },
  ];

  const testNavigation = (path: string, id: string) => {
    try {
      console.log(`✅ Testing navigation to: ${path}`);
      setTestResults((prev: any) => ({
        ...prev,
        [id]: { status: "navigating", path },
      }));
      navigate(path);
      setTestResults((prev: any) => ({
        ...prev,
        [id]: { status: "success", path },
      }));
    } catch (error) {
      console.error(`❌ Navigation failed for: ${path}`, error);
      setTestResults((prev: any) => ({
        ...prev,
        [id]: { status: "error", path, error },
      }));
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Navigation Test Suite</h1>
      <p className="text-gray-600 mb-6">
        Click each button below to test navigation to student dashboard pages:
      </p>

      <div className="space-y-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const result = testResults[action.id];

          return (
            <button
              key={action.id}
              onClick={() => testNavigation(action.path, action.id)}
              className="w-full p-4 rounded-lg border-2 border-blue-500 bg-white hover:bg-blue-50 transition-colors flex items-center gap-4"
            >
              <Icon className="w-6 h-6 text-blue-600" />
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{action.title}</div>
                <div className="text-sm text-gray-600">{action.path}</div>
              </div>
              {result && (
                <div className="text-right">
                  {result.status === "success" && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {result.status === "navigating" && (
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {result.status === "error" && (
                    <div className="text-red-600">Error</div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-bold mb-2">Test Results:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="font-bold mb-2">Console Output:</h2>
        <p className="text-sm text-gray-700">
          Open your browser's Developer Tools (F12) → Console tab to see
          detailed navigation logs.
        </p>
      </div>
    </div>
  );
};

export default NavigationTest;
