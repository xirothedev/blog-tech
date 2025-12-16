"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface Question {
	id: string;
	yesScore: number;
	noScore: number;
}

export default function VPSDecisionChecker() {
	const t = useTranslations("common.vpsChecker");
	const [answers, setAnswers] = useState<Record<string, boolean | null>>({});

	const questions: Question[] = [
		{
			id: "traffic",
			yesScore: 2,
			noScore: 0,
		},
		{
			id: "control",
			yesScore: 2,
			noScore: 0,
		},
		{
			id: "knowledge",
			yesScore: 2,
			noScore: -1,
		},
		{
			id: "software",
			yesScore: 2,
			noScore: 0,
		},
		{
			id: "budget",
			yesScore: 1,
			noScore: -1,
		},
		{
			id: "outgrow",
			yesScore: 2,
			noScore: 0,
		},
		{
			id: "performance",
			yesScore: 1,
			noScore: -1,
		},
		{
			id: "business",
			yesScore: 2,
			noScore: 0,
		},
		{
			id: "dev",
			yesScore: 1,
			noScore: 0,
		},
		{
			id: "small",
			yesScore: -2,
			noScore: 0,
		},
		{
			id: "no-learning",
			yesScore: -2,
			noScore: 0,
		},
		{
			id: "low-budget",
			yesScore: -2,
			noScore: 0,
		},
	];

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
	const answeredCount = Object.keys(answers).filter(
		(key) => answers[key] !== null && answers[key] !== undefined,
	).length;

	const getRecommendation = () => {
		if (answeredCount === 0) {
			return { text: t("recommendations.pleaseAnswer"), color: "text-gray-600" };
		}
		if (score >= 5) {
			return {
				text: t("recommendations.shouldChoose"),
				color: "text-green-600",
				bg: "bg-green-500/10",
				border: "border-green-500",
			};
		}
		if (score >= 2) {
			return {
				text: t("recommendations.consider"),
				color: "text-yellow-600",
				bg: "bg-yellow-500/10",
				border: "border-yellow-500",
			};
		}
		return {
			text: t("recommendations.notNeeded"),
			color: "text-red-600",
			bg: "bg-red-500/10",
			border: "border-red-500",
		};
	};

	const recommendation = getRecommendation();

	return (
		<div className="my-8 rounded-lg border border-gray-200 bg-transparent p-6 dark:border-gray-700">
			<p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{t("intro")}</p>

			<div className="space-y-4">
				{questions.map((q) => {
					const currentAnswer = answers[q.id];
					return (
						<div
							key={q.id}
							className="rounded-lg border border-gray-200 bg-transparent p-4 dark:border-gray-700"
						>
							<p className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
								{t(`questions.${q.id}`)}
							</p>
							<div className="flex gap-4">
								<button
									onClick={() => handleAnswer(q.id, true)}
									className={`flex-1 cursor-pointer rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
										currentAnswer === true
											? "border-green-500 bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400"
											: "border-gray-300 bg-transparent text-gray-700 hover:border-green-300 hover:bg-green-500/10 dark:border-gray-600 dark:text-gray-300 dark:hover:border-green-600 dark:hover:bg-green-500/20"
									}`}
								>
									{t("yes")} ({q.yesScore > 0 ? "+" : ""}
									{q.yesScore} {t("points")})
								</button>
								<button
									onClick={() => handleAnswer(q.id, false)}
									className={`flex-1 cursor-pointer rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
										currentAnswer === false
											? "border-red-500 bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400"
											: "border-gray-300 bg-transparent text-gray-700 hover:border-red-300 hover:bg-red-500/10 dark:border-gray-600 dark:text-gray-300 dark:hover:border-red-600 dark:hover:bg-red-500/20"
									}`}
								>
									{t("no")} ({q.noScore > 0 ? "+" : ""}
									{q.noScore} {t("points")})
								</button>
							</div>
						</div>
					);
				})}
			</div>

			<div className={`mt-6 rounded-lg border-2 p-4 ${recommendation.bg || ""} ${recommendation.border || ""}`}>
				<div className="mb-2 flex items-center justify-between">
					<span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t("totalScore")}</span>
					<span
						className={`text-2xl font-bold ${score >= 5 ? "text-green-600" : score >= 2 ? "text-yellow-600" : "text-red-600"}`}
					>
						{score}
					</span>
				</div>
				<p className={`text-base font-semibold ${recommendation.color || ""}`}>{recommendation.text}</p>
				{answeredCount < questions.length && (
					<p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
						{t("answered")}: {answeredCount}/{questions.length} {t("questionsLabel")}
					</p>
				)}
			</div>

			<button
				onClick={() => setAnswers({})}
				className="mt-4 cursor-pointer rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100/50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50"
			>
				🔄 {t("reset")}
			</button>
		</div>
	);
}
