"use client";

import { useState } from "react";

interface Question {
  id: string;
  question: string;
  yesScore: number;
  noScore: number;
}

const questions: Question[] = [
  {
    id: "traffic",
    question: "Website/App của tôi có traffic cao hoặc đang tăng trưởng?",
    yesScore: 2,
    noScore: 0,
  },
  {
    id: "control",
    question: "Tôi cần kiểm soát hoàn toàn server (root access)?",
    yesScore: 2,
    noScore: 0,
  },
  {
    id: "knowledge",
    question: "Tôi có kiến thức về Linux/Windows Server hoặc sẵn sàng học?",
    yesScore: 2,
    noScore: -1,
  },
  {
    id: "software",
    question: "Tôi cần cài đặt phần mềm đặc biệt hoặc cấu hình riêng?",
    yesScore: 2,
    noScore: 0,
  },
  {
    id: "budget",
    question: "Budget của tôi cho phép chi trả $10-50/tháng?",
    yesScore: 1,
    noScore: -1,
  },
  {
    id: "outgrow",
    question: "Shared hosting không còn đáp ứng nhu cầu?",
    yesScore: 2,
    noScore: 0,
  },
  {
    id: "performance",
    question: "Tôi cần hiệu năng tốt hơn shared hosting?",
    yesScore: 1,
    noScore: -1,
  },
  {
    id: "business",
    question: "Website/App của tôi là e-commerce hoặc business critical?",
    yesScore: 2,
    noScore: 0,
  },
  {
    id: "dev",
    question: "Tôi cần development/staging environment?",
    yesScore: 1,
    noScore: 0,
  },
  {
    id: "small",
    question: "Website của tôi rất nhỏ, chỉ là blog/portfolio cá nhân?",
    yesScore: -2,
    noScore: 0,
  },
  {
    id: "no-learning",
    question: "Tôi không muốn học về server management?",
    yesScore: -2,
    noScore: 0,
  },
  {
    id: "low-budget",
    question: "Budget của tôi rất hạn chế (dưới $5/tháng)?",
    yesScore: -2,
    noScore: 0,
  },
];

export default function VPSDecisionChecker() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});

  const handleAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const calculateScore = () => {
    let total = 0;
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer !== null && answer !== undefined) {
        total += answer ? q.yesScore : q.noScore;
      }
    });
    return total;
  };

  const score = calculateScore();
  const answeredCount = Object.keys(answers).filter((key) => answers[key] !== null && answers[key] !== undefined).length;

  const getRecommendation = () => {
    if (answeredCount === 0) {
      return { text: "Vui lòng trả lời các câu hỏi để nhận đề xuất", color: "text-gray-600" };
    }
    if (score >= 5) {
      return {
        text: "✅ Nên chọn VPS - VPS phù hợp với nhu cầu của bạn",
        color: "text-green-600",
        bg: "bg-green-500/10",
        border: "border-green-500",
      };
    }
    if (score >= 2) {
      return {
        text: "⚠️ Cân nhắc - Có thể bắt đầu với shared hosting hoặc VPS cấu hình thấp",
        color: "text-yellow-600",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500",
      };
    }
    return {
      text: "❌ Chưa cần VPS - Shared hosting sẽ phù hợp hơn",
      color: "text-red-600",
      bg: "bg-red-500/10",
      border: "border-red-500",
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="my-8 rounded-lg border border-gray-200 bg-transparent p-6 dark:border-gray-700">
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Hãy trả lời các câu hỏi sau để xác định xem VPS có phù hợp với bạn không:
      </p>

      <div className="space-y-4">
        {questions.map((q) => {
          const currentAnswer = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-lg border border-gray-200 bg-transparent p-4 dark:border-gray-700"
            >
              <p className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                {q.question}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  className={`cursor-pointer flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${currentAnswer === true
                    ? "border-green-500 bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : "border-gray-300 bg-transparent text-gray-700 hover:border-green-300 hover:bg-green-500/10 dark:border-gray-600 dark:text-gray-300 dark:hover:border-green-600 dark:hover:bg-green-500/20"
                    }`}
                >
                  Có ({q.yesScore > 0 ? "+" : ""}{q.yesScore} điểm)
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  className={`cursor-pointer flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${currentAnswer === false
                    ? "border-red-500 bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    : "border-gray-300 bg-transparent text-gray-700 hover:border-red-300 hover:bg-red-500/10 dark:border-gray-600 dark:text-gray-300 dark:hover:border-red-600 dark:hover:bg-red-500/20"
                    }`}
                >
                  Không ({q.noScore > 0 ? "+" : ""}{q.noScore} điểm)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-6 rounded-lg border-2 p-4 ${recommendation.bg || ""} ${recommendation.border || ""}`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Tổng điểm:
          </span>
          <span className={`text-2xl font-bold ${score >= 5 ? "text-green-600" : score >= 2 ? "text-yellow-600" : "text-red-600"}`}>
            {score}
          </span>
        </div>
        <p className={`text-base font-semibold ${recommendation.color || ""}`}>
          {recommendation.text}
        </p>
        {answeredCount < questions.length && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Đã trả lời: {answeredCount}/{questions.length} câu hỏi
          </p>
        )}
      </div>

      <button
        onClick={() => setAnswers({})}
        className="cursor-pointer mt-4 rounded-lg bg-transparent border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100/50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50"
      >
        🔄 Làm lại
      </button>
    </div>
  );
}

