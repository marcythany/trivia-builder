import { useState } from 'react';

type Question = {
	id: string;
	question: string;
	options: string[]; // 4 opções de resposta
};

function App() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestion, setCurrentQuestion] = useState('');
	const [options, setOptions] = useState(['', '', '', '']);

	const handleAddQuestion = () => {
		if (!currentQuestion.trim()) {
			alert('Digite a pergunta');
			return;
		}
		if (options.some((opt) => !opt.trim())) {
			alert('Preencha todas as 4 opções');
			return;
		}

		const newQuestion: Question = {
			id: crypto.randomUUID(),
			question: currentQuestion,
			options: [...options], // copia as 4 opções
		};

		setQuestions((prev) => [...prev, newQuestion]);
		// Limpar campos
		setCurrentQuestion('');
		setOptions(['', '', '', '']);
	};

	const handleRemoveQuestion = (id: string) => {
		setQuestions((prev) => prev.filter((q) => q.id !== id));
	};

	const updateOption = (index: number, value: string) => {
		setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
	};

	const handleExportJSON = () => {
		// Estrutura simplificada: apenas as perguntas
		const data = {
			questions: questions.map((q) => ({
				id: q.id,
				question: q.question,
				options: q.options,
			})),
		};

		const dataStr = JSON.stringify(data, null, 2);
		const blob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'quiz-questions.json';
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='max-w-3xl mx-auto p-6 space-y-8'>
			<h1 className='text-3xl font-bold text-center'>Construtor de Quiz</h1>
			<p className='text-center text-gray-600'>
				Crie perguntas com 4 opções. O JSON gerado será usado no site de
				recomendação de animes.
			</p>

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
						placeholder='Ex: Qual desses poderes você gostaria de ter?'
					/>
				</div>

				<div className='space-y-3'>
					<label className='block text-sm font-medium text-gray-700'>
						Opções de resposta (4 opções)
					</label>
					{options.map((opt, index) => (
						<input
							key={index}
							type='text'
							value={opt}
							onChange={(e) => updateOption(index, e.target.value)}
							placeholder={`Opção ${index + 1}`}
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
									<div className='flex-1'>
										<p className='font-medium'>{q.question}</p>
										<ul className='mt-2 space-y-1 text-sm text-gray-600'>
											{q.options.map((opt, idx) => (
												<li key={idx} className='ml-4'>
													{idx + 1}. {opt}
												</li>
											))}
										</ul>
									</div>
									<button
										onClick={() => handleRemoveQuestion(q.id)}
										className='text-red-500 hover:text-red-700 text-sm font-medium ml-4'
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
