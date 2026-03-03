import { useState } from 'react';

type Answer = {
	text: string;
	isCorrect: boolean;
};

type Question = {
	id: string;
	question: string;
	answers: Answer[];
};

function App() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestion, setCurrentQuestion] = useState('');
	const [correctAnswer, setCorrectAnswer] = useState('');
	const [wrongAnswers, setWrongAnswers] = useState(['', '', '']);

	const handleAddQuestion = () => {
		if (
			!currentQuestion.trim() ||
			!correctAnswer.trim() ||
			wrongAnswers.some((a) => !a.trim())
		) {
			alert('Preencha todos os campos');
			return;
		}

		const newQuestion: Question = {
			id: crypto.randomUUID(),
			question: currentQuestion,
			answers: [
				{ text: correctAnswer, isCorrect: true },
				...wrongAnswers.map((text) => ({ text, isCorrect: false })),
			],
		};

		setQuestions((prev) => [...prev, newQuestion]);
		// Limpar campos
		setCurrentQuestion('');
		setCorrectAnswer('');
		setWrongAnswers(['', '', '']);
	};

	const handleRemoveQuestion = (id: string) => {
		setQuestions((prev) => prev.filter((q) => q.id !== id));
	};

	const handleExportJSON = () => {
		const dataStr = JSON.stringify(questions, null, 2);
		const blob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'trivia-questions.json';
		link.click();
		URL.revokeObjectURL(url);
	};

	const updateWrongAnswer = (index: number, value: string) => {
		setWrongAnswers((prev) =>
			prev.map((item, i) => (i === index ? value : item)),
		);
	};

	return (
		<div className='max-w-3xl mx-auto p-6 space-y-8'>
			<h1 className='text-3xl font-bold text-center'>Construtor de Trivia</h1>

			{/* Formulário para nova pergunta */}
			<div className='bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-200'>
				<h2 className='text-xl font-semibold'>Nova pergunta</h2>

				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Pergunta
					</label>
					<textarea
						value={currentQuestion}
						onChange={(e) => setCurrentQuestion(e.target.value)}
						rows={2}
						className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
					/>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Resposta correta
					</label>
					<input
						type='text'
						value={correctAnswer}
						onChange={(e) => setCorrectAnswer(e.target.value)}
						className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
					/>
				</div>

				<div className='space-y-3'>
					<label className='block text-sm font-medium text-gray-700'>
						Respostas incorretas
					</label>
					{wrongAnswers.map((wa, index) => (
						<input
							key={index}
							type='text'
							value={wa}
							onChange={(e) => updateWrongAnswer(index, e.target.value)}
							placeholder={`Incorreta ${index + 1}`}
							className='block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
						/>
					))}
				</div>

				<button
					onClick={handleAddQuestion}
					className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium'
				>
					Adicionar pergunta
				</button>
			</div>

			{/* Lista de perguntas adicionadas */}
			{questions.length > 0 && (
				<div className='bg-white shadow-md rounded-lg p-6 border border-gray-200'>
					<h2 className='text-xl font-semibold mb-4'>
						Perguntas adicionadas ({questions.length})
					</h2>
					<ul className='space-y-4'>
						{questions.map((q) => (
							<li
								key={q.id}
								className='border-b border-gray-200 pb-4 last:border-0'
							>
								<div className='flex justify-between items-start'>
									<div>
										<p className='font-medium'>{q.question}</p>
										<ul className='mt-2 space-y-1 text-sm'>
											{q.answers.map((ans, idx) => (
												<li
													key={idx}
													className={
														ans.isCorrect ?
															'text-green-600 font-semibold'
														:	'text-gray-600'
													}
												>
													{ans.isCorrect ? '✅ ' : '❌ '}
													{ans.text}
												</li>
											))}
										</ul>
									</div>
									<button
										onClick={() => handleRemoveQuestion(q.id)}
										className='text-red-500 hover:text-red-700 text-sm font-medium'
									>
										Remover
									</button>
								</div>
							</li>
						))}
					</ul>

					<button
						onClick={handleExportJSON}
						className='mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium'
					>
						Exportar JSON
					</button>
				</div>
			)}
		</div>
	);
}

export default App;
